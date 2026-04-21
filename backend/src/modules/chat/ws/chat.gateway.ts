import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { AuthSecurityService } from "src/modules/auth/services/auth-security.service";
import { JwtPayload } from "src/modules/auth/strategies/access-token.strategy";
import { SessionService } from "src/modules/auth/services/session.service";
import { Inject, OnModuleDestroy, OnModuleInit, UseGuards } from "@nestjs/common";
import { WsChatGuard } from "src/common/guards/ws-chat.guard";
import { WsUser } from "src/common/decorators/ws-user.decorator";
import type { WsUserType } from "../types/ws-user.types";
import { RateLimitService } from "src/infrastructure/redis/services/rate-limit-chat.service";
import { RATE_LIMIT_CHAT_PER_10_SEC, RATE_LIMIT_CHAT_PER_SEC } from "../constants/rate-limit.constants";
import { JOB_NAMES, QUEUE_NAMES } from "src/infrastructure/queue/constants/queue.constants";
import { Queue } from "bullmq";
import { ChatEventsService } from "../services/chat-events.service";
import { RedisService } from "src/infrastructure/redis/redis.service";
import Redis from "ioredis";
import * as cookie from "cookie";

type TypingKey = string;

@WebSocketGateway({
    namespace: '/socket',
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN,
        credentials: true,
    },
    // pingTimeout: process.env.SOCKET_PING_TIMEOUT,
    // pingInterval: process.env.SOCKET_PING_INTERVAL,
})
export class ChatGateway implements OnModuleInit, OnModuleDestroy, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private sub!: Redis;

    private readonly context = ChatGateway.name;

    private typingMap = new Map<TypingKey, NodeJS.Timeout>();

    private getTypingKey({ chatId, userId }: { chatId: string, userId: string }) {
        return `${chatId}:${userId}`;
    }

    constructor(
        private readonly logger: AppLoggerService,
        private readonly authSecurityService: AuthSecurityService,
        private readonly sessionService: SessionService,
        private readonly chatEventsService: ChatEventsService,
        private readonly rateLimitService: RateLimitService,
        private readonly redisService: RedisService,

        @Inject(QUEUE_NAMES.MESSAGE)
        private readonly messageQueue: Queue,
    ) {

    }

    async onModuleInit() {
        this.sub = this.redisService.getSubscriber();
        await this.sub.subscribe('chat.message');
        this.sub.on("message", (channel, data) => {
            if (channel !== "chat.message") return;

            try {
                const message = JSON.parse(data);
                this.server
                    .to(message.chatId)
                    .emit("message_received", message);

            } catch (err) {
                this.logger.error(
                    "Failed to handle pubsub message",
                    err instanceof Error ? err.stack : JSON.stringify(err),
                    this.context
                );
            }
        });

        this.logger.log("Subscribed to chat.message", this.context);
    }

    async onModuleDestroy() {
        if (this.sub) {
            await this.sub.unsubscribe("chat.message");
            this.sub.removeAllListeners("message");
        }
    }

    async afterInit(server: Server) {
        this.logger.log("Websocket initialized", this.context);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log("Client connected " + client.id, this.context);
        try {
            const token = this.extractToken(client);
            const payload: JwtPayload = await this.authSecurityService.verifyAccessToken(token);
            const user = await this.sessionService.validateAccessToken(payload);
            client.data.user = user;
            client.data.joinedChats ??= new Set<string>();
        } catch (err) {
            this.logger.error('Connect failed', err instanceof Error ? err.stack : JSON.stringify(err), this.context);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket, ...args: any[]) {
        const user = client.data?.user;
        if (!user) return;
        this.logger.log(`User ${user?.id ?? 'unknown'} disconnected`, this.context);
        const chats = client.data?.joinedChats;
        if (chats?.size) {
            for (const chatId of chats) {
                await this.chatEventsService.handleUpdateLastSeenAt(user.id, chatId);
            }
        }
        client.data?.joinedChats.clear();
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('send_message')
    async handleSendMessage(
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string, content: string, tempId: string }
    ) {
        const perChatKey1s = `rl:chat:1s:${user.id}:${data.chatId}`;
        const perChatKey10s = `rl:chat:10s:${user.id}:${data.chatId}`;
        const globalKey1s = `rl:global:1s:${user.id}`;

        const checks = await Promise.all([
            this.rateLimitService.isAllowed(perChatKey1s, RATE_LIMIT_CHAT_PER_SEC, 1),
            this.rateLimitService.isAllowed(perChatKey10s, RATE_LIMIT_CHAT_PER_10_SEC, 10),
            this.rateLimitService.isAllowed(globalKey1s, 10, 1),
        ]);
        if (checks.includes(false)) {
            throw new WsException({
                message: 'Too many messages, slow down',
                retryAfter: 1,
            });
        }
        await this.messageQueue.add(JOB_NAMES.SEND_MESSAGE, {
            userId: user.id,
            chatId: data.chatId,
            content: data.content,
            tempId: data.tempId,
        }, {
            jobId: data.tempId,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
        })
        return {
            status: 'queued',
            tempId: data.tempId,
        };
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('typing')
    async handleTyping(
        @ConnectedSocket() client: Socket,
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string }
    ) {
        const { chatId } = data;
        const key = this.getTypingKey({ chatId, userId: user.id });
        if (this.typingMap.has(key)) {
            clearTimeout(this.typingMap.get(key));
        } else {
            client.to(chatId).emit('user_typing', {
                userId: user.id,
                fullName: user.fullName,
            });
        }
        const timeout = setTimeout(() => {
            this.typingMap.delete(key);
            client.to(chatId).emit('user_stop_typing', {
                userId: user.id,
                fullName: user.fullName,
            });
        }, 3000);

        this.typingMap.set(key, timeout);
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('stop_typing')
    async handleStopTyping(
        @ConnectedSocket() client: Socket,
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string }
    ) {
        const { chatId } = data;
        const key = this.getTypingKey({ chatId, userId: user.id });
        const existing = this.typingMap.get(key);
        if (existing) {
            clearTimeout(existing);
            this.typingMap.delete(key);
            client.to(chatId).emit('user_stop_typing', {
                userId: user.id,
                fullName: user.fullName,
            });
        }
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('join_chat')
    async handleJoinChat(
        @ConnectedSocket() client: Socket,
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string }
    ) {
        const { chatId } = data;
        client.join(chatId);
        client.data.joinedChats.add(chatId);
        const key = `lastSeen:lock:${user.id}:${chatId}`;
        const isFirst = await this.redisService.getClient().set(key, "1", "EX", 10, "NX");
        if (isFirst) {
            await this.messageQueue.add(JOB_NAMES.UPDATE_LAST_SEEN, { userId: user.id, chatId }, { removeOnComplete: true });
        }
        return { ok: true }
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('leave_chat')
    async handleLeaveChat(
        @ConnectedSocket() client: Socket,
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string }
    ) {
        const { chatId } = data;
        client.leave(chatId);
        if (client.data.joinedChats?.has(chatId))
            client.data?.joinedChats?.delete(chatId);
        await this.chatEventsService.handleUpdateLastSeenAt(user.id, chatId);
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('sync_chat')
    async handleSync(
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string, lastMessageId?: string }
    ) {
        return this.chatEventsService.getMessageAfter({
            chatId: data.chatId,
            userId: user.id,
            lastMessageId: data.lastMessageId,
        });
    }

    private extractToken(client: Socket): string {
        const authToken = client.handshake.auth?.token;
        const bearerToken =
            client.handshake.headers?.authorization?.split(" ")[1];
        const cookies = client.handshake.headers?.cookie;
        let cookieToken: string | undefined;

        if (cookies) {
            const parsed = cookie.parse(cookies);
            cookieToken = parsed["access_token"];
        }
        const token = authToken || bearerToken || cookieToken;
        this.logger.debug(
            `Token resolved: ${token ? "YES" : "NO"}`,
            this.context,
        );
        if (!token) {
            throw new WsException("Unauthorized");
        }
        return token;
    }
}
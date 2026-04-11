import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { AuthSecurityService } from "src/modules/auth/services/auth-security.service";
import { JwtPayload } from "src/modules/auth/strategies/access-token.strategy";
import { SessionService } from "src/modules/auth/services/session.service";
import { CommandBus } from "@nestjs/cqrs";
import { SendMessageCommand } from "../commands/send-message.command";
import { SendMessageResponse } from "src/generated/type";
import { UseGuards } from "@nestjs/common";
import { WsChatGuard } from "src/common/guards/ws-chat.guard";
import { WsUser } from "src/common/decorators/ws-user.decorator";
import type { WsUserType } from "../types/ws-user.types";
import { ChatService } from "../services/chat.service";

@WebSocketGateway({
    namespace: '/socket',
    cors: {
        origin: process.env.SOCKET_CORS_ORIGIN,
        credentials: true,
    },
    // pingTimeout: process.env.SOCKET_PING_TIMEOUT,
    // pingInterval: process.env.SOCKET_PING_INTERVAL,
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly context = ChatGateway.name;

    constructor(
        private readonly logger: AppLoggerService,
        private readonly authSecurityService: AuthSecurityService,
        private readonly sessionService: SessionService,
        private readonly commandBus: CommandBus,
        private readonly chatService: ChatService,
    ) { }

    afterInit(server: Server) {
        this.logger.log("Websocket initialized", this.context);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log("Client connected " + client.id);
        try {
            const token = this.extractToken(client);
            const payload: JwtPayload = await this.authSecurityService.verifyAccessToken(token);
            const user = await this.sessionService.validateAccessToken(payload);
            client.data.user = user;
        } catch (err) {
            this.logger.error('Connect failed', err instanceof Error ? err.stack : JSON.stringify(err), this.context);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket, ...args: any[]) {
        const user = client.data?.user;
        this.logger.log(`User ${user?.id ?? 'unknown'} disconnected`, this.context);
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string, content: string }
    ) {
        const { chatId, content } = data;
        const message: SendMessageResponse = await this.commandBus.execute(new SendMessageCommand(user.id, chatId, content));
        this.emitToChat(chatId, message);
        return {
            status: 'ok',
            message,
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
        client.to(chatId).emit('user_typing', {
            userId: user.id,
        });
    }

    @UseGuards(WsChatGuard)
    @SubscribeMessage('stop_typing')
    async handleStopTyping(
        @ConnectedSocket() client: Socket,
        @WsUser() user: WsUserType,
        @MessageBody() data: { chatId: string }
    ) {
        const { chatId } = data;
        client.to(chatId).emit('user_stop_typing', {
            userId: user.id,
        });
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
        await this.chatService.updateLastSeen(chatId, user.id);
    }

    private extractToken(client: Socket): string {
        const token =
            client.handshake.auth?.token ||
            client.handshake.headers['authorization']?.split(' ')[1];
        this.logger.debug(`Token: ${token}`, this.context);
        if (!token) {
            throw new WsException('Unauthorized');
        }
        return token;
    }

    private emitToChat(chatId: string, message: SendMessageResponse) {
        this.server.to(chatId).emit('message_received', message);
    }
}
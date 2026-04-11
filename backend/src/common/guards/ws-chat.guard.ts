import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { ChatService } from "src/modules/chat/services/chat.service";

@Injectable()
export class WsChatGuard implements CanActivate {
    constructor(
        private readonly chatService: ChatService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const data = context.switchToWs().getData();

        const user = client.data?.user;
        const chatId = data?.chatId;

        if (!user) {
            throw new WsException('Unauthorized');
        }

        if (!chatId) {
            throw new WsException('chatId is required');
        }

        const chat = await this.chatService.findChatByIdAndUserId(chatId, user.id);

        if (!chat) {
            throw new WsException('Access denied');
        }

        return true;
    }
}
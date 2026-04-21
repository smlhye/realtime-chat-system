import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMessagesQuery } from "../get-messages.query";
import { ChatService } from "../../services/chat.service";
import { SendMessageResponse } from "src/generated/type";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";

@QueryHandler(GetMessagesQuery)
export class GetMessagesHandler implements IQueryHandler<GetMessagesQuery> {
    constructor(
        private readonly chatService: ChatService,
    ) { }

    async execute(query: GetMessagesQuery): Promise<SendMessageResponse[]> {
        const { userId, chatId, take, cursor, after, messageId } = query.params;
        const chat = await this.chatService.findChatByIdAndUserId(chatId, userId);
        if (!chat) {
            throw new BaseException({
                code: ErrorCode.FORBIDDEN,
                message: `User ${userId} is not allowed to access chat ${chatId}`,
            })
        }
        let afterDate: string | undefined;
        if(after) {
            afterDate = after;
        } else if(messageId) {
            const message = await this.chatService.findMessageById(messageId);
            if(message) {
                afterDate = message.createdAt.toISOString();
            }
        }
        const messages = await this.chatService.findMessages({
            chatId,
            take,
            cursor,
            after: afterDate,
        });
        return messages.map((message) => ({
            id: message.id,
            senderId: message.senderId,
            chatId: message.chatId,
            content: message.content,
            createdAt: message.createdAt.toISOString(),
            tempId: message.tempId ?? undefined,
            senderName: message.sender.fullName,
            isMe: message.senderId === userId,
        }));
    }
}
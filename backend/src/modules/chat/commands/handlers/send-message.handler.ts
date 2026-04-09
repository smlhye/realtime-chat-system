import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendMessageCommand } from "../send-message.command";
import { ChatService } from "../../services/chat.service";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { SendMessageRequest, SendMessageResponse } from "src/generated/type";

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
    private readonly context = SendMessageHandler.name;
    constructor(
        private readonly chatService: ChatService,
        private readonly logger: AppLoggerService,
    ) { }

    async execute(command: SendMessageCommand): Promise<SendMessageResponse> {
        const chat = await this.chatService.findChatByIdAndUserId(command.chatId, command.senderId);
        if (!chat) throw new BaseException({
            code: ErrorCode.FORBIDDEN,
            message: 'Current user is not in this chat',
        })
        const data: SendMessageRequest = {
            senderId: command.senderId,
            chatId: command.chatId,
            content: command.content,
        }
        const message = await this.chatService.sendMessage(data);
        return {
            id: message.id,
            senderId: message.senderId,
            chatId: message.chatId,
            content: message.content,
            createdAt: message.createdAt.toISOString()
        }
    }
}
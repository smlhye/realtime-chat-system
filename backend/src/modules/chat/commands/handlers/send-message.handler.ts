import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { SendMessageCommand } from "../send-message.command";
import { ChatService } from "../../services/chat.service";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { SendMessageRequest, SendMessageResponse } from "src/generated/type";
import { MessageCreatedEvent } from "../../events/chat.events";

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
    private readonly context = SendMessageHandler.name;
    constructor(
        private readonly chatService: ChatService,
        private readonly logger: AppLoggerService,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: SendMessageCommand): Promise<SendMessageResponse> {
        this.logger.log(`SENDERID: ${command}`, this.context);
        const chat = await this.chatService.findChatByIdAndUserId(command.chatId, command.senderId);
        if (!chat) throw new BaseException({
            code: ErrorCode.FORBIDDEN,
            message: 'Current user is not in this chat',
        })

        const existing = await this.chatService.findMessageByTempId(command.tempId);

        if (existing) {
            return {
                id: existing.id,
                senderId: existing.senderId,
                chatId: existing.chatId,
                content: existing.content,
                createdAt: existing.createdAt.toISOString(),
                tempId: existing.tempId!,
                senderName: existing.sender.fullName,
                isMe: existing.senderId === command.senderId
            };
        }

        const data: SendMessageRequest = {
            senderId: command.senderId,
            chatId: command.chatId,
            content: command.content,
            tempId: command.tempId,
        }
        const message = await this.chatService.sendMessage(data);

        const messageRes: SendMessageResponse = {
            id: message.id,
            senderId: message.senderId,
            chatId: message.chatId,
            content: message.content,
            createdAt: message.createdAt.toISOString(),
            tempId: command.tempId,
            senderName: message.sender.fullName,
            isMe: message.senderId === command.senderId
        }

        // this.eventBus.publish(new MessageCreatedEvent(messageRes));

        return messageRes
    }
}
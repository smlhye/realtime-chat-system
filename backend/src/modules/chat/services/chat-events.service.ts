import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SendMessageResponse } from "src/generated/type";
import { SendMessageCommand } from "../commands/send-message.command";
import { UpdateLastSeenCommand } from "../commands/update-last-seen.command";
import { GetMessagesQuery } from "../queries/get-messages.query";

@Injectable()
export class ChatEventsService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    async handleSendMessage({ userId, chatId, content, tempId }: { userId: string, chatId: string, content: string, tempId: string }): Promise<SendMessageResponse> {
        return this.commandBus.execute(
            new SendMessageCommand(userId, chatId, content, tempId)
        );
    }

    async handleUpdateLastSeenAt(userId: string, chatId: string) {
        return this.commandBus.execute(new UpdateLastSeenCommand(userId, chatId));
    }

    async getMessageAfter({ chatId, userId, lastMessageId }: { chatId: string, userId: string, lastMessageId?: string }) {
        if (lastMessageId) {
            return this.queryBus.execute(new GetMessagesQuery({
                chatId,
                userId,
                take: 20,
                messageId: lastMessageId,
            }));
        } else {
            const messages = await this.queryBus.execute(new GetMessagesQuery({
                chatId,
                userId,
                take: 20,
            }));
            return messages.reverse();
        }
    }
}
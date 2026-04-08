import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddUsersToChatCommand } from "../add-user-to-chat.command";
import { ChatService } from "../../services/chat.service";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { AddUserToChatResponse } from "src/generated/type";

@CommandHandler(AddUsersToChatCommand)
export class AddUsersToChatHandler implements ICommandHandler<AddUsersToChatCommand> {
    constructor(
        private readonly chatService: ChatService, 
    ) { }

    async execute(command: AddUsersToChatCommand): Promise<AddUserToChatResponse> {
        const chat = await this.chatService.findChatByIdAndUserId(command.chatId, command.userMemberId);
        if(!chat) throw new BaseException({
            code: ErrorCode.FORBIDDEN,
            message: 'Current user is not in this chat',
        })
        const results = await this.chatService.addManyUsersToChat(command.userIds, command.chatId);
        return {
            chatId: command.chatId,
            users: results.map((user) => ({
                id: user.id,
                userId: user.userId,
            }))
        }
    }
}
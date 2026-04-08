import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChatCommand } from "../create-chat.command";
import { ChatService } from "../../services/chat.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { CreateChatRequest, CreateChatResponse } from "src/generated/type";
import { UserValidator } from "src/modules/user/validators/user.validator";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";

@CommandHandler(CreateChatCommand)
export class CreateChatHandler implements ICommandHandler<CreateChatCommand> {
    private readonly context = CreateChatCommand.name;
    constructor(
        private readonly chatService: ChatService,
        private readonly userValidator: UserValidator,
        private readonly logger: AppLoggerService,
    ) { }

    async execute(command: CreateChatCommand): Promise<CreateChatResponse> {
        const users = command.users;
        if(users.length <= 1) {
            throw new BaseException({
                code: ErrorCode.VALIDATION_FAILED,
                message: 'Users length is must minimum 2 items',
            })
        }

        if(users.length == 2) {
            const chatExists = await this.chatService.findPrivateBetweenUsers(users[0], users[1]);
            if(chatExists) {
                throw new BaseException({
                    code: ErrorCode.CONFLICT,
                    message: `Private chat between users ${users[0]} and ${users[1]} already exists`,
                })
            }
        }

        await Promise.all(users.map(user => this.userValidator.checkUserId(user)));
        let isGroup = false;

        if (users.length >= 3) {
            isGroup = true;
        }

        const data: CreateChatRequest = {
            name: command.name ?? undefined,
            users: users,
            isGroup: isGroup,
        };

        const createdChat = await this.chatService.createRoomChat(data);
        return createdChat;
    }
}
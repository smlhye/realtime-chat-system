import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateLastSeenCommand } from "../update-last-seen.command";
import { UnauthorizedException } from "@nestjs/common";
import { ChatService } from "../../services/chat.service";

@CommandHandler(UpdateLastSeenCommand)
export class UpdateLastSeenHandler implements ICommandHandler<UpdateLastSeenCommand> {
    private readonly context: string = UpdateLastSeenHandler.name;
    constructor(
        private readonly chatService: ChatService,
    ) { }

    async execute(command: UpdateLastSeenCommand): Promise<void> {
        await this.chatService.updateLastSeen(command.chatId, command.userId);
    }
}
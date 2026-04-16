import { ICommand } from "@nestjs/cqrs";

export class UpdateLastSeenCommand implements ICommand {
    constructor(
        public readonly userId: string,
        public readonly chatId: string,
    ) { }
}
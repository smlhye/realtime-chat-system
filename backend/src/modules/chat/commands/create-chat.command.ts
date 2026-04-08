import { ICommand } from "@nestjs/cqrs";

export class CreateChatCommand implements ICommand {
    constructor(
        public name: string | null,
        public users: string[],
    ) {}
}
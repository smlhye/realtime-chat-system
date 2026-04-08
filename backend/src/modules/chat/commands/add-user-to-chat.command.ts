import { ICommand } from "@nestjs/cqrs";

export class AddUsersToChatCommand implements ICommand {
    constructor(
        public userMemberId: string,
        public chatId: string,
        public userIds: string[]
    ) { }
}
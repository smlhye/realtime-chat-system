import { ICommand } from "@nestjs/cqrs";

export class SendMessageCommand implements ICommand {
    constructor(
        public senderId: string,
        public chatId: string,
        public content: string,
        public tempId: string,
    ) { }
}
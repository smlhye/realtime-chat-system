import { IQuery } from "@nestjs/cqrs";

export class GetMessagesQuery implements IQuery {
    constructor(
        public params: {
            chatId: string,
            userId: string,
            take?: number,
            cursor?: string,
            after?: string,
            messageId?: string,
        }
    ) { }
}
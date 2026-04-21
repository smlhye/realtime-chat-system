import { IQuery } from "@nestjs/cqrs";

export class GetChatsOfUserQuery implements IQuery {
    constructor(
        public params: {
            userId: string,
            name?: string,
            take?: number,
            cursor?: string,
        }
    ) { }
}
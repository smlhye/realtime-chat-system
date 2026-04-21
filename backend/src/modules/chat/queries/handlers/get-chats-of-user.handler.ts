import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChatsOfUserQuery } from "../get-chats-of-user.query";
import { CreateChatResponse } from "src/generated/type";
import { ChatService } from "../../services/chat.service";
import { UserValidator } from "src/modules/user/validators/user.validator";

@QueryHandler(GetChatsOfUserQuery)
export class GetChatsOfUserHandler implements IQueryHandler<GetChatsOfUserQuery> {
    constructor(
        private readonly chatService: ChatService,
        private readonly userValidator: UserValidator,
    ) { }

    async execute(query: GetChatsOfUserQuery): Promise<CreateChatResponse[]> {
        await this.userValidator.checkUserId(query.params.userId, 'exists');
        return this.chatService.findChatsOfUser(query.params);
    }
}
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import type { AddUserToChatRequest, CreateChatRequest } from "src/generated/type";
import type { JwtPayload } from "../auth/strategies/access-token.strategy";
import { CommandBus } from "@nestjs/cqrs";
import { CreateChatCommand } from "./commands/create-chat.command";
import { AddUsersToChatCommand } from "./commands/add-user-to-chat.command";

@Controller('chats')
export class ChatController {

    constructor(
        private readonly commandBus: CommandBus,
    ) { }

    @Post()
    @UseGuards(AccessTokenGuard)
    async createChat(
        @Body() data: CreateChatRequest,
        @CurrentUser() user: JwtPayload,
    ) {
        const users = Array.from(new Set([user.sub, ...data.users]));
        return this.commandBus.execute(new CreateChatCommand(data.name ?? null, users));
    }

    @Post(':chatId/users')
    @UseGuards(AccessTokenGuard)
    async addUsersToChat(
        @Param('chatId') chatId: string,
        @Body() data: AddUserToChatRequest,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        return this.commandBus.execute(new AddUsersToChatCommand(currentUser.sub, chatId, data.userIds));
    }
}
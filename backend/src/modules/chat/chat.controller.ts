import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import type { AddUserToChatRequest, CreateChatRequest, SendMessageRequest } from "src/generated/type";
import type { JwtPayload } from "../auth/strategies/access-token.strategy";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateChatCommand } from "./commands/create-chat.command";
import { AddUsersToChatCommand } from "./commands/add-user-to-chat.command";
import { SendMessageCommand } from "./commands/send-message.command";
import { GetMessagesQuery } from "./queries/get-messages.query";
import { GetChatsOfUserQuery } from "./queries/get-chats-of-user.query";

@Controller('chats')
export class ChatController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
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

    @Get()
    @UseGuards(AccessTokenGuard)
    async getChatOfUser(
        @CurrentUser() user: JwtPayload,
        @Query('name') name?: string,
        @Query('take') take?: string,
        @Query('cursor') cursor?: string,
    ) {
        const parsedTake = take ? parseInt(take, 10) : 20;
        const limit = Math.min(parsedTake, 50);
        return this.queryBus.execute(new GetChatsOfUserQuery({
            userId: user.sub,
            name,
            take: limit,
            cursor,
        }))
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

    @Post(':chatId/messages')
    @UseGuards(AccessTokenGuard)
    async sendMessage(
        @Param('chatId') chatId: string,
        @Body() data: SendMessageRequest,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        return this.commandBus.execute(new SendMessageCommand(currentUser.sub, chatId, data.content, data.tempId));
    }

    @Get(':chatId/messages')
    @UseGuards(AccessTokenGuard)
    async getMessagesOfChat(
        @CurrentUser() currentUser: JwtPayload,
        @Param('chatId') chatId: string,
        @Query('take') take?: string,
        @Query('cursor') cursor?: string,
        @Query('after') after?: string,
        @Query('messageId') messageId?: string,
    ) {
        const parsedTake = take ? parseInt(take, 10) : 20;
        const limit = Math.min(parsedTake, 50);
        return this.queryBus.execute(new GetMessagesQuery({
            userId: currentUser.sub,
            chatId,
            take: limit,
            cursor,
            after,
            messageId,
        }));
    }
}
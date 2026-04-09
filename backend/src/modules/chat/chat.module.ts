import { Module } from "@nestjs/common";
import { ChatService } from "./services/chat.service";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateChatCommand } from "./commands/create-chat.command";
import { CreateChatHandler } from "./commands/handlers/create-chat.handler";
import { ChatUserRepository } from "./repositories/chat-user.repository";
import { ChatRepository } from "./repositories/chat.repository";
import { MessageRepository } from "./repositories/message.repository";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { UserValidator } from "../user/validators/user.validator";
import { UserRepository } from "../user/repositories/user.repository";
import { ChatController } from "./chat.controller";
import { AddUsersToChatCommand } from "./commands/add-user-to-chat.command";
import { AddUsersToChatHandler } from "./commands/handlers/add-user-to-chat.handler";
import { SendMessageCommand } from "./commands/send-message.command";
import { SendMessageHandler } from "./commands/handlers/send-message.handler";

@Module({
    imports: [
        CqrsModule,
    ],
    providers: [
        AppLoggerService,
        
        UserValidator,
        UserRepository,

        ChatUserRepository,
        ChatRepository,
        MessageRepository,

        ChatService,

        CreateChatCommand,
        CreateChatHandler,

        AddUsersToChatCommand,
        AddUsersToChatHandler,

        SendMessageCommand,
        SendMessageHandler,
    ],
    controllers: [
        ChatController,
    ],
    exports: [
        ChatService,
    ]
})
export class ChatModule { }
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
import { ChatGateway } from "./ws/chat.gateway";
import { AuthSecurityService } from "../auth/services/auth-security.service";
import { SessionService } from "../auth/services/session.service";
import { JwtService } from "@nestjs/jwt";
import { SessionRepository } from "../auth/repositories/session.repository";
import { UserService } from "../user/services/user.service";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { WsChatGuard } from "src/common/guards/ws-chat.guard";
import { WsAuthGuard } from "src/common/guards/ws-auth.guard";

@Module({
    imports: [
        CqrsModule,
    ],
    providers: [
        AppLoggerService,
        
        ChatGateway,
        AuthSecurityService,
        SessionService,
        SessionRepository,
        JwtService,
        WsChatGuard,
        WsAuthGuard,

        UserValidator,
        UserService,
        UserRepository,

        RedisService,

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
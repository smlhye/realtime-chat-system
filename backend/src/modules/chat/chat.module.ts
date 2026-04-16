import { Module } from "@nestjs/common";
import { ChatService } from "./services/chat.service";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateChatHandler } from "./commands/handlers/create-chat.handler";
import { ChatUserRepository } from "./repositories/chat-user.repository";
import { ChatRepository } from "./repositories/chat.repository";
import { MessageRepository } from "./repositories/message.repository";
import { ChatController } from "./chat.controller";
import { AddUsersToChatHandler } from "./commands/handlers/add-user-to-chat.handler";
import { SendMessageHandler } from "./commands/handlers/send-message.handler";
import { WsChatGuard } from "src/common/guards/ws-chat.guard";
import { WsAuthGuard } from "src/common/guards/ws-auth.guard";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { ChatEventListener } from "./events/listeners/chat-event.listener";
import { UpdateLastSeenHandler } from "./commands/handlers/update-last-seen.handler";
import { GetMessagesHandler } from "./queries/handlers/get-messages.handler";
import { RedisModule } from "src/infrastructure/redis/redis.module";
import { ChatEventsService } from "./services/chat-events.service";

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        UserModule,
        LoggerModule,
        RedisModule,
    ],
    providers: [
        // ChatGateway,
        ChatEventsService,
        
        WsChatGuard,
        WsAuthGuard,

        ChatRepository,
        ChatUserRepository,
        MessageRepository,

        ChatService,

        CreateChatHandler,
        AddUsersToChatHandler,
        SendMessageHandler,
        // ChatEventListener,
        UpdateLastSeenHandler,
        GetMessagesHandler,
    ],
    controllers: [
        ChatController,
    ],
    exports: [
        ChatService, ChatEventsService,
    ]
})
export class ChatModule { }
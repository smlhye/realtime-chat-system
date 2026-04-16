import { Module } from "@nestjs/common";
import { ChatModule } from "../chat.module";
import { ChatGateway } from "./chat.gateway";
import { AuthModule } from "src/modules/auth/auth.module";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { RedisModule } from "src/infrastructure/redis/redis.module";
import { QueueModule } from "src/infrastructure/queue/queue.module";

@Module({
    imports: [
        ChatModule,
        AuthModule,
        LoggerModule,
        RedisModule,
        QueueModule,
    ],
    providers: [ChatGateway],
})
export class ChatWsModule { }
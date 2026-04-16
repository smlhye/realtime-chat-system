import { Module } from "@nestjs/common";
import { PrismaModule } from "src/infrastructure/database/prisma/prisma.module";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { RedisModule } from "src/infrastructure/redis/redis.module";
import { ChatModule } from "src/modules/chat/chat.module";
import { MessageWorker } from "./message.worker";
import { AppConfigModule } from "src/config/config.module";

@Module({
    imports: [
        ChatModule,
        RedisModule,
        LoggerModule,
        PrismaModule,
        AppConfigModule,
    ],
    providers: [MessageWorker],
})
export class WorkerModule { }
import { Module } from "@nestjs/common";
import { QUEUE_NAMES } from "./constants/queue.constants";
import { RedisService } from "../redis/redis.service";
import { Queue } from "bullmq";
import { ChatModule } from "src/modules/chat/chat.module";
import { RedisModule } from "../redis/redis.module";
import { LoggerModule } from "../logger/logger.module";
import { AppConfigModule } from "src/config/config.module";
import { PrismaModule } from "../database/prisma/prisma.module";

@Module({
    imports: [
        ChatModule,
        RedisModule,
        LoggerModule,
        AppConfigModule,
        PrismaModule,
    ],
    providers: [
        {
            provide: QUEUE_NAMES.MESSAGE,
            inject: [RedisService],
            useFactory: (redisService: RedisService) => {
                return new Queue(QUEUE_NAMES.MESSAGE, {
                    connection: redisService.getClient(),
                })
            },
        },
    ],
    exports: [QUEUE_NAMES.MESSAGE],
})
export class QueueModule { }
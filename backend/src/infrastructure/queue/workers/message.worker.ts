import { Worker } from "bullmq";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { JOB_NAMES, QUEUE_NAMES } from "../constants/queue.constants";
import { ChatEventsService } from "src/modules/chat/services/chat-events.service";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

@Injectable()
export class MessageWorker implements OnModuleInit, OnModuleDestroy {
    private worker!: Worker;
    private readonly context = MessageWorker.name;
    constructor(
        private readonly redisService: RedisService,
        private readonly chatEventsService: ChatEventsService,
        private readonly logger: AppLoggerService,
    ) { }

    onModuleInit() {
        this.worker = new Worker(
            QUEUE_NAMES.MESSAGE,
            async job => {
                try {
                    const redis = this.redisService.getPublisher();
                    switch (job.name) {
                        case JOB_NAMES.SEND_MESSAGE: {
                            const { userId, chatId, content, tempId } = job.data;
                            const message = await this.chatEventsService.handleSendMessage({
                                userId,
                                chatId,
                                content,
                                tempId,
                            });

                            await redis.publish("chat.message", JSON.stringify(message));
                            break;
                        }
                        case JOB_NAMES.UPDATE_LAST_SEEN: {
                            const { userId, chatId } = job.data;
                            await this.chatEventsService.handleUpdateLastSeenAt(userId, chatId);
                            break;
                        }
                        default:
                            this.logger.warn(`Unknown job: ${job.name}`, this.context);
                    }
                } catch (err) {
                    this.logger.error("Worker job failed", err instanceof Error ? err.stack : JSON.stringify(err), this.context);
                    throw err;
                }
            }, {
            connection: this.redisService.getClient().duplicate(),
            concurrency: 50,
        });
        this.logger.log("MessageWorker started", this.context);

        this.worker.on("completed", (job) => {
            this.logger.log(`Job completed: ${job.id}`, this.context);
        });

        this.worker.on("failed", (job, err) => {
            this.logger.error(`Job failed: ${job?.id}`, err instanceof Error ? err.stack : JSON.stringify(err), this.context);
        });
    }

    async onModuleDestroy() {
        this.logger.log('Closing worker...', this.context);
        await this.worker.close();
    }
}
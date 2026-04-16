import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { AppLoggerService } from "../logger/logger.service";
import { AppConfigService } from "src/config/config.service";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    private publisher: Redis;
    private subscriber: Redis;
    private context: string = RedisService.name;

    constructor(
        private readonly logger: AppLoggerService,
        private readonly configService: AppConfigService,
    ) {
        const redisConfig = this.configService.redis;
        const baseConfig = {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            maxRetriesPerRequest: null,
        };
        this.client = new Redis(baseConfig)

        this.publisher = this.client.duplicate();
        this.subscriber = new Redis({
            ...baseConfig,
            enableReadyCheck: false,
        })
    }

    onModuleInit() {
        [
            this.client,
            this.publisher,
            this.subscriber
        ].forEach((conn, index) => {
            const name = ['client', 'publisher', 'subscriber'][index];
            conn?.on('connect', () =>
                this.logger.log(`Redis ${name} connected`, this.context),
            );

            conn?.on('ready', () =>
                this.logger.log(`Redis ${name} ready`, this.context),
            );

            conn?.on('error', (err) =>
                this.logger.error(`Redis ${name} error`, err.stack || String(err), this.context)
            );
        })
    }

    onModuleDestroy() {
        this.client.quit();
        this.publisher.quit();
        this.subscriber.quit();

        this.logger.log('Redis connections closed', 'RedisService');
    }

    getClient(): Redis {
        if (!this.client) {
            this.logger.error('Redis client not initialized', undefined, this.context);
            throw new Error('Redis not initialized');
        }
        this.logger.debug('Redis client retrieved', this.context);
        return this.client;
    }

    getPublisher(): Redis {
        if (!this.publisher) {
            this.logger.error('Redis publisher not initialized', undefined, this.context);
            throw new Error('Redis publisher not initialized');
        }
        this.logger.debug('Redis publisher retrieved', this.context);
        return this.publisher;
    }

    getSubscriber(): Redis {
        if (!this.subscriber) {
            this.logger.error('Redis subcriber not initialized', undefined, this.context);
            throw new Error('Redis subcriber not initialized');
        }
        this.logger.debug('Redis subcriber retrieved', this.context);
        return this.subscriber;
    }
}
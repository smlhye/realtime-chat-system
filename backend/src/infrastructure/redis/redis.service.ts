import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { AppLoggerService } from "../logger/logger.service";
import { AppConfigService } from "src/config/config.service";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis | null = null;

    constructor(
        private readonly logger: AppLoggerService,
        private readonly configService: AppConfigService,
    ) { }

    onModuleInit() {
        const redisConfig = this.configService.redis;
        this.client = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db
        })

        this.client.on('connect', () =>
            this.logger.log('Redis connected', 'RedisService')
        );

        this.client.on('error', (err) =>
            this.logger.error('Redis error', err.stack || String(err), 'RedisService')
        );

        this.client.on('ready', () =>
            this.logger.log('Redis is ready to accept commands', 'RedisService')
        );
    }

    onModuleDestroy() {
        if (this.client) {
            this.client.quit();
            this.logger.log('Redis connection closed', 'RedisService');
        }
    }

    getClient(): Redis {
        if (!this.client) {
            this.logger.error('Redis client not initialized', undefined, 'RedisService');
            throw new Error('Redis not initialized');
        }
        this.logger.debug('Redis client retrieved', 'RedisService');
        return this.client;
    }
}
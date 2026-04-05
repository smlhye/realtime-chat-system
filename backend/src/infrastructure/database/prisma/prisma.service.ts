import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { createPrismaExtension } from "./prisma.extension";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly logger: AppLoggerService,
    ) {
        super({
            log: process.env.NODE_ENV === "production" ? ['query', 'error', 'warn'] : ['error', 'warn'],
        });

        this.$extends(createPrismaExtension(this.logger));
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected', 'Prisma');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected', 'Prisma');
    }

    async isConnected(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (err) {
            this.logger.error('Database connection check failed', (err as Error).stack, 'Prisma');
            return false;
        }
    }
}
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { createPrismaExtension } from "./prisma.extension";
import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AppConfigService } from "src/config/config.service";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly logger: AppLoggerService,
        private readonly appConfigService: AppConfigService,
    ) {
        const adapter = new PrismaPg({
            connectionString: appConfigService.database.url,
        })
        super({
            adapter,
            log: appConfigService.app.isProd ? ['query', 'error', 'warn'] : ['error', 'warn'],
        })

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
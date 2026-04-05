import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class HealthCheckService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async checkDb(): Promise<{ status: string }> {
        const connected = await this.prisma.isConnected();
        return { status: connected ? 'up' : 'down' };
    }
}
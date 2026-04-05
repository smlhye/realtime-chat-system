import { Controller, Get } from "@nestjs/common";
import { HealthCheckService } from "./health.service";

@Controller('health')
export class HealthCheckController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
    ) { }

    @Get('db')
    async checkDb() {
        const dbStatus = await this.healthCheckService.checkDb();
        return {
            service: 'realtime-chat',
            database: dbStatus.status,
            timestamp: new Date().toISOString(),
        }
    }
}
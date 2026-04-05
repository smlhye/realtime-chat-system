import { Controller, Get } from "@nestjs/common";
import { HealthCheckService } from "./health.service";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode, ErrorCodeConfig } from "src/common/constants/error-codes";

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

    @Get('error')
    async throwError() {
        throw new BaseException({
            code: ErrorCode.INTERNAL_ERROR,
            message: 'This is a test error from HealthCheckController',
            status: ErrorCodeConfig[ErrorCode.INTERNAL_ERROR].status,
        })
    }

    @Get('')
    async checkHealth() {
        return {
            service: 'realtime-chat',
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
}
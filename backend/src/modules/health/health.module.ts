import { Module } from "@nestjs/common";
import { HealthCheckController } from "./health.controller";
import { HealthCheckService } from "./health.service";
import { PrismaModule } from "src/infrastructure/database/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [HealthCheckService],
    controllers: [HealthCheckController],
})

export class HealthCheckModule { }
import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module";
import { LoggerModule } from "./infrastructure/logger/logger.module";
import { PrismaModule } from "./infrastructure/database/prisma/prisma.module";
import { HealthCheckModule } from "./modules/health/health.module";

@Module({
    imports: [
        AppConfigModule,
        LoggerModule,
        PrismaModule,
        HealthCheckModule,
    ],
})
export class AppModule { }
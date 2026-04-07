import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module";
import { LoggerModule } from "./infrastructure/logger/logger.module";
import { PrismaModule } from "./infrastructure/database/prisma/prisma.module";
import { HealthCheckModule } from "./modules/health/health.module";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        AppConfigModule,
        LoggerModule,
        PrismaModule,
        HealthCheckModule,
        RedisModule,
        UserModule,
        AuthModule,
        ScheduleModule.forRoot(),
    ],
})
export class AppModule { }
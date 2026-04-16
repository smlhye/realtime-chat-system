import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { SignUpHandler } from "./commands/handlers/sign-up.handler";
import { LocalStrategy } from "./strategies/local.strategy";
import { SessionService } from "./services/session.service";
import { AuthSecurityService } from "./services/auth-security.service";
import { SessionRepository } from "./repositories/session.repository";
import { JwtService } from "@nestjs/jwt";
import { SignOutCurrentDeviceHandler } from "./commands/handlers/sign-out-current-device.handler";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { SessionCleanupService } from "./services/session-cleanup.service";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { RefreshHandler } from "./commands/handlers/refresh.handler";
import { SignOutAllDeviceHandler } from "./commands/handlers/sign-out-all-device.handler";
import { RedisModule } from "src/infrastructure/redis/redis.module";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        CqrsModule,
        UserModule,
        RedisModule,
        LoggerModule,
    ],
    providers: [
        AuthSecurityService,
        SessionService,
        SessionRepository,
        SessionCleanupService,

        LocalStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,

        SignUpHandler,
        SignOutCurrentDeviceHandler,
        RefreshHandler,
        SignOutAllDeviceHandler,

        JwtService,
    ],
    controllers: [AuthController],
    exports: [
        AuthSecurityService,
        SessionService,
    ]
})
export class AuthModule { }
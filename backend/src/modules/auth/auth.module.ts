import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { SignUpHandler } from "./commands/handlers/sign-up.handler";
import { LocalStrategy } from "./strategies/local.strategy";
import { AppConfigService } from "src/config/config.service";
import { UserSecurityService } from "../user/services/user-security.service";
import { SessionService } from "./services/session.service";
import { AuthSecurityService } from "./services/auth-security.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { UserValidator } from "../user/validators/user.validator";
import { SessionRepository } from "./repositories/session.repository";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../user/repositories/user.repository";
import { SignOutCurrentDeviceCommand } from "./commands/sign-out-current-device.command";
import { SignOutCurrentDeviceHandler } from "./commands/handlers/sign-out-current-device.handler";
import { SignUpCommand } from "./commands/sign-up.command";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";

@Module({
    imports: [CqrsModule],
    providers: [
        SignUpHandler,
        LocalStrategy,
        AppConfigService,
        UserSecurityService,
        SessionService,
        AuthSecurityService,
        AppLoggerService,
        UserValidator,
        SessionRepository,
        JwtService,
        UserRepository,
        RedisService,
        AccessTokenStrategy,

        SignUpCommand,
        SignUpHandler,

        SignOutCurrentDeviceCommand,
        SignOutCurrentDeviceHandler,
    ],
    controllers: [AuthController]
})
export class AuthModule { }
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserRepository } from "./repositories/user.repository";
import { UserValidator } from "./validators/user.validator";
import { UserSecurityService } from "./services/user-security.service";
import { CreateUserCommand } from "./commands/create-user.command";
import { CreateUserHandler } from "./commands/handlers/create-user.handler";
import { UserController } from "./user.controller";
import { GetByIdQuery } from "./queries/get-by-id.query";
import { GetByIdHandler } from "./queries/handlers/get-by-id.handler";
import { AccessTokenStrategy } from "../auth/strategies/access-token.strategy";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { UserService } from "./services/user.service";
import { SessionService } from "../auth/services/session.service";
import { SessionRepository } from "../auth/repositories/session.repository";

@Module({
    imports:[CqrsModule],
    providers: [
        UserRepository,
        UserValidator,
        UserSecurityService,
        UserService,

        SessionService,
        SessionRepository,

        CreateUserCommand,
        CreateUserHandler,

        GetByIdQuery,
        GetByIdHandler,

        AccessTokenStrategy,
        RedisService,
    ],
    controllers: [
        UserController,
    ],
    exports: [
        UserService,
    ]
})
export class UserModule { }
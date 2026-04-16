import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserRepository } from "./repositories/user.repository";
import { UserValidator } from "./validators/user.validator";
import { UserSecurityService } from "./services/user-security.service";
import { CreateUserHandler } from "./commands/handlers/create-user.handler";
import { UserController } from "./user.controller";
import { GetByIdHandler } from "./queries/handlers/get-by-id.handler";
import { UserService } from "./services/user.service";
import { LoggerModule } from "src/infrastructure/logger/logger.module";

@Module({
    imports: [
        CqrsModule,
        LoggerModule],
    providers: [
        UserRepository,
        UserValidator,
        UserSecurityService,
        UserService,
        CreateUserHandler,
        GetByIdHandler,
    ],
    controllers: [
        UserController,
    ],
    exports: [
        UserService,
        UserRepository,
        UserValidator,
        UserSecurityService,
    ]
})
export class UserModule { }
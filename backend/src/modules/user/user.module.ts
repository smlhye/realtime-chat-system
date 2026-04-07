import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserRepository } from "./repositories/user.repository";
import { UserValidator } from "./validators/user.validator";
import { UserSecurityService } from "./services/user-security.service";
import { CreateUserCommand } from "./commands/create-user.command";
import { CreateUserHandler } from "./commands/handlers/create-user.handler";

@Module({
    imports:[CqrsModule],
    providers: [
        UserRepository,
        UserValidator,
        UserSecurityService,

        CreateUserCommand,
        CreateUserHandler,
    ],
    exports: [
        
    ]
})
export class UserModule { }
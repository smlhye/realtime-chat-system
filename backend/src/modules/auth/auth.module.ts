import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { SignUpHandler } from "./commands/handlers/sign-up.handler";

@Module({
    imports: [CqrsModule],
    providers: [SignUpHandler],
    controllers: [AuthController]
})
export class AuthModule { }
import { ICommand } from "@nestjs/cqrs";
import { JwtPayload } from "../strategies/access-token.strategy";

export class SignOutAllDeviceCommand implements ICommand {
    constructor(
        public jwtPayload: JwtPayload,
    ) { }
}
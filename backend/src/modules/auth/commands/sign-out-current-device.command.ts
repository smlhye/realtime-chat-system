import { ICommand } from "@nestjs/cqrs";
import { JwtPayload } from "../strategies/access-token.strategy";

export class SignOutCurrentDeviceCommand implements ICommand {
    constructor(
        public refreshToken: string,
        public jwtPayload: JwtPayload,
        public device: string,
        public ip: string,
    ) { }
}
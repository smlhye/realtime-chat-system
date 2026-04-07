import { ICommand } from "@nestjs/cqrs";
import { RefreshTokenPayload } from "../strategies/refresh-token.strategy";

export class RefreshCommand implements ICommand {
    constructor(
        public refreshTokenPayload: RefreshTokenPayload,
    ) { }
}
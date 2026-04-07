import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RefreshTokenPayload } from "src/modules/auth/strategies/refresh-token.strategy";

export const RefreshToken = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): RefreshTokenPayload => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    }
)
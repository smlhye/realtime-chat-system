import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/modules/auth/strategies/access-token.strategy";

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): JwtPayload => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    }
)
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SignInResponse } from "src/generated/type";

export const SignInData = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): SignInResponse => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
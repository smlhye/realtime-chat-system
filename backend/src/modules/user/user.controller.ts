import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { JwtPayload } from "../auth/strategies/access-token.strategy";
import { QueryBus } from "@nestjs/cqrs";
import { UserResponse } from "src/generated/type";
import { GetByIdQuery } from "./queries/get-by-id.query";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";

@Controller('users')
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
    ) { }

    @Get('me')
    @UseGuards(AccessTokenGuard)
    async getMe(
        @CurrentUser() user: JwtPayload
    ): Promise<UserResponse> {
        return this.queryBus.execute(new GetByIdQuery(user.sub));
    }
}
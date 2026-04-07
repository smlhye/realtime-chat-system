import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import type { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from "src/generated/type";
import { schemas } from "src/generated/client";
import { SignUpCommand } from "./commands/sign-up.command";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import { SignInData } from "src/common/decorators/sign-in.decorator";

@Controller('auth')
export class AuthController {
    private readonly context = AuthController.name;
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly logger: AppLoggerService,
    ) { }

    @Post('sign-up')
    async signUp(
        @Body() data: SignUpRequest
    ): Promise<SignUpResponse> {
        this.logger.debug(`Received sign-up request: ${JSON.stringify(data)}`, this.context);
        const parsed = schemas.SignUpRequest.safeParse(data);
        if (!parsed.success) {
            this.logger.warn(`Validation failed: ${JSON.stringify(parsed.error.issues)}`, this.context);
            throw new BadRequestException(parsed.error.issues);
        }
        const { username, email, password, fullName } = parsed.data;
        this.logger.debug(`Validation passed. Executing SignUpCommand for username=${username}`, this.context);
        try {
            const result = await this.commandBus.execute(
                new SignUpCommand(username, email, password, fullName)
            );
            this.logger.log(`User created successfully: ${result.id} (${username})`, this.context);
            return result;
        } catch (err) {
            if (err instanceof Error)
                this.logger.error(`SignUp failed: ${err.message}`, err.stack, this.context);
            throw err;
        }
    }

    @Post('sign-in')
    @UseGuards(AuthGuard('local'))
    async signIn(
        @Res({ passthrough: true }) res: Response,
        @SignInData() signInData: SignInResponse,
    ) {
        res.cookie('refresh_token', signInData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(signInData.expiresAt!)
        });
        return {
            accessToken: signInData.accessToken,
            tokenType: signInData.tokenType,
            expiresAt: signInData.expiresAt,
        };
    }
}
import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import type { SignInResponse, SignUpRequest, SignUpResponse } from "src/generated/type";
import { schemas } from "src/generated/client";
import { SignUpCommand } from "./commands/sign-up.command";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import type { Response, Request } from "express";
import { SignInData } from "src/common/decorators/sign-in.decorator";
import { SignInLocalGuard } from "src/common/guards/local.guard";
import { AppConfigService } from "src/config/config.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { JwtPayload } from "./strategies/access-token.strategy";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { SignOutCurrentDeviceCommand } from "./commands/sign-out-current-device.command";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { RefreshTokenGuard } from "src/common/guards/refresh-token.guard";
import { RefreshToken } from "src/common/decorators/refresh.decorator";
import type { RefreshTokenPayload } from "./strategies/refresh-token.strategy";
import { RefreshCommand } from "./commands/refresh.command";
import { SignOutAllDeviceCommand } from "./commands/sign-out-all-device.command";

@Controller('auth')
export class AuthController {
    private readonly context = AuthController.name;
    constructor(
        private readonly commandBus: CommandBus,
        private readonly logger: AppLoggerService,
        private readonly appConfigService: AppConfigService,
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
    @UseGuards(SignInLocalGuard)
    async signIn(
        @Res({ passthrough: true }) res: Response,
        @SignInData() signInData: SignInResponse,
    ) {
        res.cookie('refresh_token', signInData.refreshToken, {
            httpOnly: true,
            secure: this.appConfigService.app.isProd,
            sameSite: 'strict',
            expires: new Date(signInData.refreshExpiresAt as string)
        });
        return {
            accessToken: signInData.accessToken,
            tokenType: signInData.tokenType,
            expiresAt: signInData.expiresAt,
        };
    }

    @Post('sign-out')
    @UseGuards(AccessTokenGuard)
    async signOut(
        @CurrentUser() payload: JwtPayload,
        @Req() req: Request,
    ) {
        const refreshToken = req?.cookies?.refresh_token;
        if (!refreshToken) {
            throw new BaseException({
                code: ErrorCode.UNAUTHORIZED,
                message: 'Refresh token not found',
            })
        }
        const device = req.headers['user-agent'] || 'unknown';
        const ip = req.ip || '0.0.0.0';

        await this.commandBus.execute(new SignOutCurrentDeviceCommand(
            refreshToken,
            payload,
            device,
            ip
        ))
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refresh(
        @RefreshToken() refreshTokenPayload: RefreshTokenPayload
    ) {
        return this.commandBus.execute(new RefreshCommand(refreshTokenPayload));
    }

    @Post('sign-out-all')
    @UseGuards(AccessTokenGuard)
    async signOutAll(
        @CurrentUser() jwtPayload: JwtPayload,
    ) {
        return this.commandBus.execute(new SignOutAllDeviceCommand(jwtPayload));
    }
}
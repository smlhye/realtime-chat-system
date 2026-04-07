import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { ErrorCode } from "src/common/constants/error-codes";
import { BaseException } from "src/common/errors/base.exception";
import { UserSecurityService } from "src/modules/user/services/user-security.service";
import { UserValidator } from "src/modules/user/validators/user.validator";
import { JwtPayload } from "./access-token.strategy";
import { AppConfigService } from "src/config/config.service";
import { RefreshTokenPayload } from "./refresh-token.strategy";
import { SessionService } from "../services/session.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { v4 as uuidv4 } from 'uuid';
import { AuthSecurityService } from "../services/auth-security.service";
import { SignInResponse } from "src/generated/type";
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly context = LocalStrategy.name;
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly userValidator: UserValidator,
        private readonly userSecurityService: UserSecurityService,
        private readonly sessionService: SessionService,
        private readonly authSecurityService: AuthSecurityService,
        private readonly logger: AppLoggerService,
    ) {
        super({
            passReqToCallback: true,
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(req: Request, username: string, password: string): Promise<SignInResponse> {
        this.logger.debug(`Sign-in attempt for username=${username}`, this.context);
        const user = await this.userValidator.checkUsername(username, 'exists');
        const isMatch = await this.userSecurityService.comparePassword(password, user?.password!);
        if (!isMatch) {
            this.logger.warn(`Invalid password for username=${username}`, this.context);
            throw new BaseException({
                code: ErrorCode.AUTH_FAILED,
                message: 'Password is not valid',
            });
        }

        this.logger.debug(`Password validated successfully for username=${username}`, this.context);

        const accessTokenId = uuidv4();
        const refreshTokenId = uuidv4();
        const device = req.headers['x-device-id'] as string || 'unknown';
        const ip = req.ip || '0.0.0.0';
        const now = Math.floor(Date.now() / 1000);

        this.logger.debug(`Generating tokens for username=${username}, device=${device}, ip=${ip}`, this.context);

        const accessPayload: JwtPayload = {
            sub: user?.id!,
            aud: this.appConfigService.jwt.audience,
            iss: this.appConfigService.jwt.issuer,
            iat: now,
            exp: now + this.authSecurityService.getAccessTokenExpiresIn(),
            jti: accessTokenId,
        };

        const refreshPayload: RefreshTokenPayload = {
            sub: user?.id!,
            jti: refreshTokenId,
            device: device,
            ip: ip,
            iat: now,
            exp: now + this.authSecurityService.getRefreshTokenExpiresIn(),
        };

        const accessToken = this.authSecurityService.generateAccessToken(accessPayload);
        const refreshToken = this.authSecurityService.generateRefreshToken(refreshPayload);
        const accessExpiresAt = new Date(accessPayload.exp! * 1000).toISOString();
        const refreshExpiresAt = new Date(refreshPayload.exp! * 1000).toISOString();

        this.logger.debug(`Tokens generated for username=${username}`, this.context);

        const sessionInDeviceExists = await this.sessionService.findByDeviceAndIpActive(device, ip);
        if (sessionInDeviceExists) {
            this.logger.debug(`Refresh token is exists in this device and ip`, this.context);
            await this.sessionService.revokedToken(sessionInDeviceExists.id);
        }

        await this.sessionService.createSession(
            refreshTokenId,
            refreshToken,
            device,
            ip,
            user?.id!,
            refreshExpiresAt
        );

        this.logger.log(`Session created for username=${username}, tokenId=${refreshTokenId}`, this.context);
        this.logger.log(`Sign-in successful for username=${username}`, this.context);

        return {
            accessToken: accessToken,
            tokenType: 'Bearer',
            expiresAt: accessExpiresAt,
            refreshToken: refreshToken,
        };
    }
}
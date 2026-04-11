import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppConfigService } from "src/config/config.service";
import { JwtPayload } from "../strategies/access-token.strategy";
import { RefreshTokenPayload } from "../strategies/refresh-token.strategy";
import { parseToSeconds } from "src/common/utils/time.utils";
import { StringValue } from "ms";

@Injectable()
export class AuthSecurityService {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async generateAccessToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.sign(
            payload, {
            secret: this.appConfigService.jwt.secret,
        });
    }

    async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
        return this.jwtService.sign(
            payload, {
            secret: this.appConfigService.jwt.refreshSecret,
        });
    }

    async getAccessTokenExpiresIn(): Promise<number> {
        return parseToSeconds(this.appConfigService.jwt.expiresIn as StringValue);
    }

    async getRefreshTokenExpiresIn(): Promise<number> {
        return parseToSeconds(this.appConfigService.jwt.refreshExpiresIn as StringValue);
    }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
        return this.jwtService.verify(token, {
            secret: this.appConfigService.jwt.secret,
        });
    }

    async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
        return this.jwtService.verify(token, {
            secret: this.appConfigService.jwt.refreshSecret,
        });
    }
}
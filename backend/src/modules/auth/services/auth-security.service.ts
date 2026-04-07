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

    generateAccessToken(payload: JwtPayload): string {
        return this.jwtService.sign(
            payload, {
            secret: this.appConfigService.jwt.secret,
        });
    }

    generateRefreshToken(payload: RefreshTokenPayload): string {
        return this.jwtService.sign(
            payload, {
            secret: this.appConfigService.jwt.refreshSecret,
        });
    }

    getAccessTokenExpiresIn(): number {
        return parseToSeconds(this.appConfigService.jwt.expiresIn as StringValue);
    }

    getRefreshTokenExpiresIn(): number {
        return parseToSeconds(this.appConfigService.jwt.refreshExpiresIn as StringValue);
    }

    verifyAccessToken(token: string): JwtPayload {
        return this.jwtService.verify(token, {
            secret: this.appConfigService.jwt.secret,
        });
    }

    verifyRefreshToken(token: string): RefreshTokenPayload {
        return this.jwtService.verify(token, {
            secret: this.appConfigService.jwt.refreshSecret,
        });
    }
}
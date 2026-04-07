import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AppConfigService } from "src/config/config.service";

export type RefreshTokenPayload = {
    sub: string,
    jti?: string,
    device?: string,
    ip?: string,
    iat?: number,
    exp?: number,
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly appConfigService: AppConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.refresh_token;
                }
            ]),
            secretOrKey: appConfigService.jwt.refreshSecret,
            ignoreExpiration: false,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payload: RefreshTokenPayload) {
        return payload;
    }
}
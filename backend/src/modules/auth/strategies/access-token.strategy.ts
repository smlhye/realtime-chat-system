import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from "src/config/config.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { RedisService } from "src/infrastructure/redis/redis.service";

export type JwtPayload = {
    sub: string,
    aud?: string,
    iss?: string,
    iat?: number,
    exp?: number,
    jti?: string,
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly redisService: RedisService,
        private readonly logger: AppLoggerService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: appConfigService.jwt.secret,
            ignoreExpiration: false
        })
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
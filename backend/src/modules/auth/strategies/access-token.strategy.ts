import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ErrorCode } from "src/common/constants/error-codes";
import { BaseException } from "src/common/errors/base.exception";
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
    private readonly context = AccessTokenStrategy.name;
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
        const jti = payload.jti;
        if (jti) {
            const isBlacklisted = await this.redisService.getClient().get(`bl:${jti}`);
            if (isBlacklisted) {
                this.logger.warn(`Access token with jti=${jti} is blacklisted`, this.context);
                throw new BaseException({
                    code: ErrorCode.UNAUTHORIZED,
                    message: 'Token has been revoked',
                })
            }
        }
        return payload;
    }
}
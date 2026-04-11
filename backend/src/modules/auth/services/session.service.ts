import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SessionRepository } from "../repositories/session.repository";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { JwtPayload } from "../strategies/access-token.strategy";
import { UserService } from "src/modules/user/services/user.service";
import { RedisService } from "src/infrastructure/redis/redis.service";

@Injectable()
export class SessionService {
    private readonly context: string = SessionService.name;
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userService: UserService,
        private readonly logger: AppLoggerService,
        private readonly redisService: RedisService,
    ) { }

    async createSession(
        id: string,
        token: string,
        device: string,
        ip: string,
        userId: string,
        expiresAt: string,
    ) {
        this.logger.log(`Creating session for userId=${userId}, device=${device}, ip=${ip}`, this.context);
        const session = await this.sessionRepository.create({
            id,
            user: {
                connect: {
                    id: userId,
                }
            },
            ip,
            token,
            device,
            expiresAt: new Date(expiresAt)
        })
        this.logger.log(`Session created with id=${session.id}`, this.context);
    }

    async findById(id: string) {
        this.logger.log(`Finding session by id=${id}`, this.context);
        const session = await this.sessionRepository.findById(id);
        if (!session) {
            this.logger.warn(`Session with id=${id} not found`, this.context);
        }
        return session;
    }

    async findByToken(token: string) {
        this.logger.log(`Finding session by token=${token}`, this.context);
        const session = await this.sessionRepository.findByToken(token);
        if (!session) {
            this.logger.warn(`Session with token=${token} not found`, this.context);
        }
        return session;
    }

    async findByDeviceAndIpActive(device: string, ip: string) {
        this.logger.log(`Finding session by device: ${device} and ip: ${ip}`, this.context);
        const session = await this.sessionRepository.findByDeviceAndIpActive(device, ip);
        if (!session) {
            this.logger.warn(`Session by device: ${device} and ip: ${ip} is not found`, this.context);
        }
        return session;
    }

    async revokedToken(id: string) {
        this.logger.log(`Revoking session by id=${id}`, this.context);
        const session = await this.sessionRepository.findById(id);
        if (!session) {
            this.logger.warn(`Session with id=${id} not found`, this.context);
        }
        await this.sessionRepository.revokedToken(id);
        this.logger.log(`Revoked session by id=${id}`, this.context);
    }

    async revokedTokenByUserId(userId: string) {
        this.logger.log(`Revoking sessions by userId=${userId}`, this.context);
        await this.sessionRepository.revokedTokenByUserId(userId);
    }

    async cleanTokensRevoked(): Promise<number> {
        this.logger.log(`Cleaning revoked/expired/inactive sessions`, this.context);
        const count = await this.sessionRepository.cleanToken();
        this.logger.log(`Cleaned ${count} sessions`, this.context);
        return count;
    }

    async validateAccessToken(payload: JwtPayload) {
        this.logger.log(`Validating access token for sub=${payload.sub}`, this.context);
        const user = await this.userService.findById(payload.sub);
        if (!user) {
            this.logger.warn(`User not found: ${payload.sub}`, this.context);
            throw new UnauthorizedException('User is not found');
        }
        if (payload.tokenVersion !== user.tokenVersion) {
            this.logger.warn(`Token version mismatch for user=${user.id}`, this.context);
            throw new UnauthorizedException('Token is revoked');
        }
        const jti = payload.jti;
        if (jti) {
            const isBlacklisted = await this.redisService
                .getClient()
                .get(`bl:${jti}`);

            if (isBlacklisted) {
                this.logger.warn(`Token blacklisted jti=${jti}`, this.context);
                throw new UnauthorizedException('Token has been revoked');
            }
        }
        return user;
    }
}
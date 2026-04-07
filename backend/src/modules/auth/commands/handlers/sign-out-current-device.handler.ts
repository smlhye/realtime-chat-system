import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignOutCurrentDeviceCommand } from "../sign-out-current-device.command";
import { SessionService } from "../../services/session.service";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

@CommandHandler(SignOutCurrentDeviceCommand)
export class SignOutCurrentDeviceHandler implements ICommandHandler<SignOutCurrentDeviceCommand> {
    private readonly context = SignOutCurrentDeviceHandler.name;
    constructor(
        private readonly logger: AppLoggerService,
        private readonly sessionService: SessionService,
        private readonly redisService: RedisService,
    ) { }

    async execute(command: SignOutCurrentDeviceCommand): Promise<void> {
        const session = await this.sessionService.findByToken(command.refreshToken);
        if (!session || !session.isActive) throw new BaseException({
            code: ErrorCode.UNAUTHORIZED,
            message: 'Session is invalid or expired',
        });

        if(session.expiresAt < new Date()) {
            await this.sessionService.revokedToken(session.id);
            return;
        }

        if (session.device !== command.device || session.ip !== command.ip || session.userId !== command.jwtPayload.sub) {
            throw new BaseException({
                code: ErrorCode.FORBIDDEN,
                message: 'Device or IP mismatch',
            })
        }
        await this.sessionService.revokedToken(session.id);

        const jti = command.jwtPayload?.jti;
        const exp = command.jwtPayload?.exp;
        if (jti && exp) {
            const ttlSeconds = Math.max(0, Math.floor(exp - Date.now() / 1000));
            if (ttlSeconds > 0) {
                await this.redisService.getClient().set(`bl:${jti}`, 'true', 'EX', ttlSeconds);
                this.logger.debug(`Token jti=${jti} blacklisted for ${ttlSeconds}s`, 'RedisService');
            }
        }
    }
}
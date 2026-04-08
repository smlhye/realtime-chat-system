import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignOutAllDeviceCommand } from "../sign-out-all-device.command";
import { SessionService } from "../../services/session.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { UserService } from "src/modules/user/services/user.service";

@CommandHandler(SignOutAllDeviceCommand)
export class SignOutAllDeviceHandler implements ICommandHandler<SignOutAllDeviceCommand> {
    constructor(
        private readonly sessionService: SessionService,
        private readonly logger: AppLoggerService,
        private readonly redisService: RedisService,
        private readonly userService: UserService,
    ) { }

    async execute(command: SignOutAllDeviceCommand): Promise<void> {
        const userId = command.jwtPayload.sub;
        await this.sessionService.revokedTokenByUserId(userId);
        await this.userService.increaseTokenVersion(userId);
    }
}
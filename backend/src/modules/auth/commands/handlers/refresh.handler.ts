import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshCommand } from "../refresh.command";
import { SignInResponse } from "src/generated/type";
import { SessionService } from "../../services/session.service";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { AuthSecurityService } from "../../services/auth-security.service";
import { JwtPayload } from "../../strategies/access-token.strategy";
import { AppConfigService } from "src/config/config.service";
import { v4 as uuidv4 } from 'uuid';
import { UserService } from "src/modules/user/services/user.service";

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
    private readonly context = RefreshHandler.name;
    constructor(
        private readonly sessionService: SessionService,
        private readonly logger: AppLoggerService,
        private readonly authSecurityService: AuthSecurityService,
        private readonly appConfigService: AppConfigService,
        private readonly userService: UserService,
    ) { }

    async execute(command: RefreshCommand): Promise<SignInResponse> {
        const {jti, sub} = command.refreshTokenPayload;
        if (!jti) {
            throw new BaseException({
                code: ErrorCode.UNAUTHORIZED,
                message: 'Refresh token invalid',
            })
        }
        const user = await this.userService.findById(sub);
        if (!user) {
            throw new BaseException({
                code: ErrorCode.UNAUTHORIZED,
                message: 'User is not found',
            })
        }
        const session = await this.sessionService.findById(jti);
        if (!session || !session.isActive) throw new BaseException({
            code: ErrorCode.UNAUTHORIZED,
            message: 'Session is invalid or expired',
        });

        if (session.expiresAt < new Date()) {
            await this.sessionService.revokedToken(session.id);
            throw new BaseException({
                code: ErrorCode.UNAUTHORIZED,
                message: 'Session is invalid or expired',
            })
        }
        const now = Math.floor(Date.now() / 1000);
        
        const accessTokenId = uuidv4();
        const accessPayload: JwtPayload = {
            sub,
            tokenVersion: user.tokenVersion,
            aud: this.appConfigService.jwt.audience,
            iss: this.appConfigService.jwt.issuer,
            iat: now,
            exp: now + (await this.authSecurityService.getAccessTokenExpiresIn()),
            jti: accessTokenId,
        };
        
        const accessToken = await this.authSecurityService.generateAccessToken(accessPayload);
        const accessExpiresAt = new Date(accessPayload.exp! * 1000).toISOString();
        return {
            accessToken: accessToken,
            tokenType: 'Bearer',
            expiresAt: accessExpiresAt,
        };
    }
}
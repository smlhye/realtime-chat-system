import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

type CheckMode = "unique" | "exists";

@Injectable()
export class UserValidator {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly logger: AppLoggerService,
    ) { }

    async checkEmail(
        email: string,
        mode: CheckMode = "unique"
    ) {
        this.logger.debug(`Checking email "${email}" with mode "${mode}"`, 'UserValidator');
        const user = await this.userRepo.findByEmail(email);
        if (mode === "unique") {
            if (user) {
                this.logger.warn(`Email "${email}" already exists`, 'UserValidator');
                throw new BaseException({
                    code: ErrorCode.EMAIL_ALREADY_EXISTS,
                    message: 'Email already exists',
                });
            }
            this.logger.debug(`Email "${email}" is unique`, 'UserValidator');
        } else if (mode === "exists") {
            if (!user) {
                this.logger.warn(`Email "${email}" not found`, 'UserValidator');
                throw new BaseException({
                    code: ErrorCode.USER_NOT_FOUND,
                    message: 'Email not found',
                });
            }
            this.logger.debug(`Email "${email}" exists`, 'UserValidator');
            return user;
        } else {
            this.logger.error(`Invalid check mode for email: "${mode}"`, 'UserValidator');
            throw new BaseException({
                code: ErrorCode.INTERNAL_ERROR,
                message: 'Invalid check mode [Email]',
            });
        }
    }

    async checkUsername(username: string, mode: CheckMode = "unique") {
        this.logger.debug(`Checking username "${username}" with mode "${mode}"`, 'UserValidator');
        const user = await this.userRepo.findByUsername(username);
        if (mode === "unique") {
            if (user) {
                this.logger.warn(`Username "${username}" already exists`, 'UserValidator');
                throw new BaseException({
                    code: ErrorCode.USERNAME_ALREADY_EXISTS,
                    message: 'Username already exists',
                });
            }
            this.logger.debug(`Username "${username}" is unique`, 'UserValidator');
        } else if (mode === "exists") {
            if (!user) {
                this.logger.warn(`Username "${username}" not found`, 'UserValidator');
                throw new BaseException({
                    code: ErrorCode.USER_NOT_FOUND,
                    message: 'Username not found',
                });
            }
            this.logger.debug(`Username "${username}" exists`, 'UserValidator');
            return user;
        } else {
            this.logger.error(`Invalid check mode for username: "${mode}"`, 'UserValidator');
            throw new BaseException({
                code: ErrorCode.INTERNAL_ERROR,
                message: 'Invalid check mode [Username]',
            });
        }
    }

    async checkUserId(userId: string, mode: CheckMode = "exists") {
        const user = await this.userRepo.findById(userId);
        if (mode === "unique") {
            if (user) {
                throw new BaseException({
                    code: ErrorCode.USERNAME_ALREADY_EXISTS,
                    message: 'UserId already exists',
                });
            }
        } else if (mode === "exists") {
            if (!user) {
                throw new BaseException({
                    code: ErrorCode.USER_NOT_FOUND,
                    message: `UserId with id=${userId} not found`,
                });
            }
            return user;
        } else {
            throw new BaseException({
                code: ErrorCode.INTERNAL_ERROR,
                message: 'Invalid check mode [UserId]',
            });
        }
    }
}
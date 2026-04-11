import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UserValidator } from "../validators/user.validator";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
    ) { }

    async findById(userId: string) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new BaseException({
                code: ErrorCode.USER_NOT_FOUND,
                message: `User with id:${userId} is not found`,
            })
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async increaseTokenVersion(userId: string) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new BaseException({
                code: ErrorCode.USER_NOT_FOUND,
                message: `User with id:${userId} is not found`,
            })
        }
        await this.userRepo.update(userId, { tokenVersion: user.tokenVersion + 1 });
    }
}
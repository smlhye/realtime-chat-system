import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetByIdQuery } from "../get-by-id.query";
import { UserRepository } from "../../repositories/user.repository";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/constants/error-codes";
import { UserResponse } from "src/generated/type";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery> {
    private readonly context = GetByIdHandler.name;
    constructor(
        private readonly userRepo: UserRepository,
        private readonly logger: AppLoggerService,
    ) { }

    async execute(query: GetByIdQuery): Promise<UserResponse> {
        this.logger.log(`Finding user by id:${query.id}`, this.context);
        const user = await this.userRepo.findById(query.id);
        if (!user) {
            this.logger.warn(`User with id=${query.id} is not found`, this.context);
            throw new BaseException({
                code: ErrorCode.USER_NOT_FOUND,
                message: `User with id=${query.id} is not found`,
            });
        }
        this.logger.log(`Finding user successfully`, this.context);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            createdAt: user.createdAt.toISOString(),
        }
    }
}
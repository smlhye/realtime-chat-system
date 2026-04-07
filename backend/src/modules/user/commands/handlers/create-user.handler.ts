import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../create-user.command";
import { UserRepository } from "../../repositories/user.repository";
import { UserValidator } from "../../validators/user.validator";
import { UserSecurityService } from "../../services/user-security.service";
import { SignUpResponse } from "src/generated/type";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    private readonly context = CreateUserHandler.name;
    constructor(
        private readonly userRepo: UserRepository,
        private readonly userValidator: UserValidator,
        private readonly userSecurityService: UserSecurityService,
        private readonly logger: AppLoggerService,
    ) { }

    async execute(command: CreateUserCommand): Promise<SignUpResponse> {
        const { email, username, password, fullName } = command;
        this.logger.debug(`Executing CreateUserCommand for ${email}`, this.context);
        try {
            const [, , hashedPassword] = await Promise.all([
                this.userValidator.checkEmail(email, 'unique'),
                this.userValidator.checkUsername(username, 'unique'),
                this.userSecurityService.hashPassword(password),
            ]);

            const createdUser = await this.userRepo.create({
                fullName,
                username,
                email,
                password: hashedPassword
            });

            this.logger.log(`User created with id: ${createdUser.id}`, this.context);

            return {
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email,
                fullName: createdUser.fullName,
                createdAt: createdUser.createdAt.toISOString(),
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error(`CreateUserCommand failed for ${email}`, error.stack, this.context);
            } else {
                this.logger.error(`CreateUserCommand failed for ${email}`, JSON.stringify(error), this.context);
            }
            throw error;
        }
    }
}
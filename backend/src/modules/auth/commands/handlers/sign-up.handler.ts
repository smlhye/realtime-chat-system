import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignUpCommand } from "../sign-up.command";
import { SignUpResponse } from "src/generated/type";
import { CreateUserCommand } from "src/modules/user/commands/create-user.command";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
    private readonly context = SignUpHandler.name;
    constructor(
        private readonly commandBus: CommandBus,
        private readonly logger: AppLoggerService,
    ) { }

    async execute(command: SignUpCommand): Promise<SignUpResponse> {
        this.logger.debug(`Executing SignUpCommand for username=${command.username}, email=${command.email}`, this.context);

        try {
            const result = await this.commandBus.execute(
                new CreateUserCommand(
                    command.username,
                    command.email,
                    command.password,
                    command.fullName,
                )
            );

            this.logger.log(`User created successfully: id=${result.id}, username=${result.username}`, this.context);
            return result;

        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error(`SignUpCommand failed for username=${command.username}`, error.stack, this.context);
            } else {
                this.logger.error(`SignUpCommand failed for username=${command.username}`, JSON.stringify(error), this.context);
            }
            throw error;
        }
    }
}
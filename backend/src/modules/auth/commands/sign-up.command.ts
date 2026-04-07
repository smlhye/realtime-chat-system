import { ICommand } from "@nestjs/cqrs";

export class SignUpCommand implements ICommand {
    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly fullName: string,
    ) { }
}
import { Injectable } from "@nestjs/common";
import { AppConfigService } from "src/config/config.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSecurityService {
    constructor(
        private readonly appConfigService: AppConfigService,
    ) { }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = this.appConfigService.security.saltRounds || 10;
        return bcrypt.hash(password, saltRounds);
    }
}
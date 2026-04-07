import { Injectable } from "@nestjs/common";
import { AppLoggerService } from "src/infrastructure/logger/logger.service";
import { SessionService } from "./session.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class SessionCleanupService {
    private isRunning = false;
    private readonly context = SessionCleanupService.name;
    constructor(
        private readonly logger: AppLoggerService,
        private readonly sessionService: SessionService,
    ) { }

    @Cron("0 */10 * * * *")
    async handleCleanup() {
        if (this.isRunning) {
            this.logger.warn("Cleanup job skipped (already running)", this.context);
            return;
        }
        this.isRunning = true;
        try {
            const start = Date.now();
            const count = await this.sessionService.cleanTokensRevoked();
            const duration = Date.now() - start;
            this.logger.log(`Cleanup success: deleted ${count} sessions in ${duration}ms`, this.context);
        } catch (error) {
            if (error instanceof Error)
                this.logger.error("Cleanup failed", error.stack, this.context);
        } finally {
            this.isRunning = false;
        }
    }
}
import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { PrismaService } from "./prisma.service";
import { AppConfigModule } from "src/config/config.module";

@Global()
@Module({
    imports: [LoggerModule, AppConfigModule],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
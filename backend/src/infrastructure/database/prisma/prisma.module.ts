import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
    imports: [LoggerModule],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
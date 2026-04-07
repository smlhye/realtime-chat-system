import { Module } from "@nestjs/common";
import { AppConfigService } from "src/config/config.service";
import { RedisService } from "./redis.service";

@Module({
    providers: [AppConfigService, RedisService],
    exports: [RedisService],
})
export class RedisModule { }
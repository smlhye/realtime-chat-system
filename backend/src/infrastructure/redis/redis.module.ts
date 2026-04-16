import { Module } from "@nestjs/common";
import { AppConfigService } from "src/config/config.service";
import { RedisService } from "./redis.service";
import { RateLimitService } from "./services/rate-limit-chat.service";

@Module({
    providers: [AppConfigService, RedisService, RateLimitService],
    exports: [RedisService, RateLimitService],
})
export class RedisModule { }
import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis.service";

@Injectable()
export class RateLimitService {
    constructor(
        private readonly redisService: RedisService,
    ) { }

    async isAllowed(key: string, limit: number, windowSec: number): Promise<boolean> {
        const redis = this.redisService.getClient();
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSec);
        }
        return current <= limit;
    }
}
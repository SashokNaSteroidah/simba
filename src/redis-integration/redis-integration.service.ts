import { Injectable } from '@nestjs/common';
import Redis          from "ioredis";

@Injectable()
export class RedisIntegrationService extends Redis {
    onModuleDestroy(): void {
        this.disconnect();
    }
}

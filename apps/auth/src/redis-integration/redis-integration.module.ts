import {Module}                  from '@nestjs/common';
import {RedisIntegrationService} from './redis-integration.service';
import {RedisModule}             from "@liaoliaots/nestjs-redis";

@Module({
    imports  : [
        RedisModule.forRoot({
            config: {
                db: 0,
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT)
            }
        })
    ],
    providers: [RedisIntegrationService],
    exports  : [RedisIntegrationService]
})
export class RedisIntegrationModule {
}

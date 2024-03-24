import { Module } from '@nestjs/common';
import { RedisIntegrationService } from './redis-integration.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [RedisModule.forRoot({
    config: {
      url: process.env.REDIS_URL
    }
  })],
  providers: [RedisIntegrationService],
  exports: [RedisIntegrationService]
})
export class RedisIntegrationModule {}

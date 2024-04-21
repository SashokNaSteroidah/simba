import { Module } from '@nestjs/common';
import { RedisIntegrationService } from './redis-integration.service';

@Module({
  providers: [RedisIntegrationService],
  exports: [RedisIntegrationService],
})
export class RedisIntegrationModule {}

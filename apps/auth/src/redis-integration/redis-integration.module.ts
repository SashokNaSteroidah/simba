import { Module } from '@nestjs/common';
import { RedisIntegrationService } from './redis-integration.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  providers: [RedisIntegrationService],
  exports: [RedisIntegrationService],
})
export class RedisIntegrationModule {}

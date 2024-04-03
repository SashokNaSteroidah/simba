import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisIntegrationService extends Redis {
  onModuleInit(): void {
    console.log(process.env.REDIS_PORT, process.env.REDIS_HOST);
  }
  onModuleDestroy(): void {
    this.disconnect();
  }
}

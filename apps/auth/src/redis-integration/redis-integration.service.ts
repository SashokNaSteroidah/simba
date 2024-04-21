import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {config}       from "../../../../conf";
@Injectable()
export class RedisIntegrationService{
  readonly redisClient = new Redis(config.AUTH.redis_url_auth)
  onModuleInit(): void {
    this.redisClient.connect(() => console.log("Redis successfully connected"))
  }
  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }
}

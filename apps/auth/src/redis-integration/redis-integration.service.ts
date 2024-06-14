import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {ConfigService} from "@nestjs/config";
@Injectable()
export class RedisIntegrationService{
  constructor(private readonly configService: ConfigService) {}
  readonly redisClient = new Redis(this.configService.get("AUTH_REDIS_URL"))
  onModuleInit(): void {
    this.redisClient.connect(() => console.log("Redis successfully connected"))
  }
  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }
}

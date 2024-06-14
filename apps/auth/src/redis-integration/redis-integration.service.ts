import {
  Injectable,
  Logger
} from '@nestjs/common';
import Redis from 'ioredis';
import {ConfigService} from "@nestjs/config";
@Injectable()
export class RedisIntegrationService{
  private readonly logger = new Logger(RedisIntegrationService.name)

  constructor(
      private readonly configService: ConfigService
  ) {}
  readonly redisClient = new Redis(this.configService.get("AUTH_REDIS_URL"))
  onModuleInit(): void {
    this.redisClient.connect(() => this.logger.debug(`Redis successfully connected`))
  }
  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }
}

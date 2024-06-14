import {
  Injectable,
  Logger
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  private readonly logger = new Logger(DatabaseService.name)
  async onModuleInit(): Promise<void> {
    this.logger.debug('DatabaseService successfully connected');
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.debug('DatabaseService disconnect');
    await this.$disconnect();
  }
}

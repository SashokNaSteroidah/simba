import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {RedisIntegrationModule} from "../redis-integration/redis-integration.module";
import {DatabaseModule} from "../database/database.module";

@Module({
  imports: [RedisIntegrationModule, DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

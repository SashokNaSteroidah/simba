import { Module } from '@nestjs/common';
import { RedisIntegrationModule } from '../redis-integration/redis-integration.module';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { VerifierService } from './verifier.service';
import { VerifierController } from './verifier.controller';
import {config} from "../../../../conf";

@Module({
  imports: [
    RedisIntegrationModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: config.GENERAL.secret_for_jwt,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  providers: [VerifierService],
  controllers: [VerifierController],
})
export class VerifierModule {}

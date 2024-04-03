import { Module } from '@nestjs/common';
import { RedisIntegrationModule } from '../redis-integration/redis-integration.module';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../consts/jwtSecret.consts';
import { VerifierService } from './verifier.service';
import { VerifierController } from './verifier.controller';

@Module({
  imports: [
    RedisIntegrationModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  providers: [VerifierService],
  controllers: [VerifierController],
})
export class VerifierModule {}

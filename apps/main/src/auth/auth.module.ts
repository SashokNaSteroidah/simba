import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {config} from "../../../../conf";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.GENERAL.secret_for_jwt,
      signOptions: { expiresIn: '1800s' },
    }),
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.TCP,
        options: {
          host: config.GENERAL.auth_host,
          port: +config.GENERAL.auth_port,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

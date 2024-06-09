import {Module}                 from '@nestjs/common';
import {JwtModule}              from '@nestjs/jwt';
import {RedisIntegrationModule} from './redis-integration/redis-integration.module';
import {VerifierModule}         from './verifier/verifier.module';
import {DatabaseModule}         from './database/database.module';
import {config}                 from "../../../conf";
import {AuthController}         from "./auth.controller";
import {AuthService}            from "./auth.service";

@Module({
    imports    : [
        RedisIntegrationModule,
        DatabaseModule,
        JwtModule.register({
            global     : true,
            secret     : config.GENERAL.secret_for_jwt,
            signOptions: {expiresIn: '1800s'},
        }),
        VerifierModule,
    ],
    controllers: [AuthController],
    providers  : [AuthService],
})
export class AuthModule {
}

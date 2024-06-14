import {Module}                 from '@nestjs/common';
import {JwtModule}              from '@nestjs/jwt';
import {RedisIntegrationModule} from './redis-integration/redis-integration.module';
import {VerifierModule}         from './verifier/verifier.module';
import {DatabaseModule}         from './database/database.module';
import {AuthController}         from "./auth.controller";
import {AuthService}            from "./auth.service";
import {ConfigModule}           from "@nestjs/config";

@Module({
    imports    : [
        RedisIntegrationModule,
        DatabaseModule,
        JwtModule.register({
            global     : true,
            secret     : process.env.SECRET_FOR_JWT,
            signOptions: {expiresIn: '1800s'},
        }),
        ConfigModule.forRoot({
            envFilePath: "../../.env",
            isGlobal: true
        }),
        VerifierModule,
    ],
    controllers: [AuthController],
    providers  : [AuthService],
})
export class AuthModule {
}

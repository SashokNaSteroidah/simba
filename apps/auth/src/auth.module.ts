import {Module}                 from '@nestjs/common';
import {JwtModule}              from '@nestjs/jwt';
import {RedisIntegrationModule} from './redis-integration/redis-integration.module';
import {VerifierModule}         from './verifier/verifier.module';
import {DatabaseModule}         from './database/database.module';
import {AuthController}         from "./auth.controller";
import {AuthService}            from "./auth.service";
import {
    ConfigModule,
    ConfigService
}                               from "@nestjs/config";
import {LokiLoggerModule}       from "nestjs-loki-logger";

@Module({
    imports    : [
        LokiLoggerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                lokiUrl: configService.get('LOKI_URL'),
                labels: {
                    "manual_logs": "simba-auth",
                    "ctx": "auth"
                },
                logToConsole: true,
                gzip: false
            }),
            inject: [ConfigService],
        }),
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

import {Module}                 from '@nestjs/common';
import {RedisIntegrationModule} from '../redis-integration/redis-integration.module';
import {DatabaseModule}         from '../database/database.module';
import {JwtModule}              from '@nestjs/jwt';
import {VerifierService}        from './verifier.service';
import {VerifierController}     from './verifier.controller';
import {LokiLoggerModule}       from "nestjs-loki-logger";
import {
    ConfigModule,
    ConfigService
}                               from "@nestjs/config";

@Module({
    imports    : [
        LokiLoggerModule.forRootAsync({
            imports   : [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                lokiUrl     : configService.get('LOKI_URL'),
                labels      : {
                    "manual_logs": "simba-auth",
                    "ctx": "auth"
                },
                logToConsole: true,
                gzip        : false
            }),
            inject    : [ConfigService],
        }),
        RedisIntegrationModule,
        DatabaseModule,
        JwtModule.register({
            global     : true,
            secret     : process.env.SECRET_FOR_JWT,
            signOptions: {expiresIn: '1800s'},
        }),
    ],
    providers  : [VerifierService],
    controllers: [VerifierController],
})
export class VerifierModule {
}

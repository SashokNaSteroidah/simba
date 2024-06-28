import {Module}             from '@nestjs/common';
import {AuthController}     from './auth.controller';
import {AuthService}        from './auth.service';
import {JwtModule}          from '@nestjs/jwt';
import {
    ClientsModule,
    Transport
}                           from '@nestjs/microservices';
import {LokiLoggerModule}   from "nestjs-loki-logger";
import {
    ConfigModule,
    ConfigService
}                           from "@nestjs/config";

@Module({
    imports    : [
        LokiLoggerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                lokiUrl: configService.get('LOKI_URL'),
                labels: {
                    "manual_logs": "simba-app",
                    "ctx": "auth"
                },
                logToConsole: true,
                gzip: false
            }),
            inject: [ConfigService],
        }),
        JwtModule.register({
            global     : true,
            secret     : process.env.SECRET_FOR_JWT,
            signOptions: {expiresIn: '1800s'},
        }),
        ClientsModule.register([
            {
                name     : "auth",
                transport: Transport.TCP,
                options  : {
                    host: process.env.AUTH_HOST,
                    port: +process.env.AUTH_PORT,
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers  : [
        AuthService,
    ],
})
export class AuthModule {
}

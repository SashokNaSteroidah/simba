import {Module}           from '@nestjs/common';
import {UsersController}  from './users.controller';
import {UsersService}     from './users.service';
import {DatabaseModule}   from '../database/database.module';
import {
    ClientsModule,
    Transport
}                         from '@nestjs/microservices';
import {LokiLoggerModule} from "nestjs-loki-logger";
import {
    ConfigModule,
    ConfigService
}                         from "@nestjs/config";
import * as process       from "process";


@Module({
    imports    : [
        LokiLoggerModule.forRootAsync({
            imports   : [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                lokiUrl     : configService.get('LOKI_URL'),
                labels      : {
                    "manual_logs": "simba-app",
                    "ctx": "users"
                },
                logToConsole: true,
                gzip        : false
            }),
            inject    : [ConfigService],
        }),
        ClientsModule.register([
            {
                name     : 'auth',
                transport: Transport.TCP,
                options  : {
                    host: process.env.AUTH_HOST,
                    port: +process.env.AUTH_PORT,
                },
            },
        ]),
        DatabaseModule,
    ],
    controllers: [UsersController],
    providers  : [
        UsersService
    ],
})
export class UsersModule {
}

import {Module}           from '@nestjs/common';
import {PostController}   from './post.controller';
import {PostService}      from './post.service';
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

@Module({
    imports    : [
        LokiLoggerModule.forRootAsync({
            imports   : [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                lokiUrl     : configService.get('LOKI_URL'),
                labels      : {
                    "manual_logs": "simba-app",
                    "ctx": "post"
                },
                logToConsole: true,
                gzip        : false
            }),
            inject    : [ConfigService],
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
        DatabaseModule,
    ],
    controllers: [PostController],
    providers  : [
        PostService,
    ],
})
export class PostModule {
}

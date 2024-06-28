import {Module}           from '@nestjs/common';
import {AppController}    from './app.controller';
import {AppService}       from './app.service';
import {AuthModule}       from './auth/auth.module';
import {DatabaseModule}   from './database/database.module';
import {PostModule}       from './post/post.module';
import {
    ConfigModule,
    ConfigService
}                         from '@nestjs/config';
import {UsersModule}      from './users/users.module';
import {LokiLoggerModule} from "nestjs-loki-logger";
import {PrometheusModule} from "@willsoto/nestjs-prometheus";

@Module({
    imports    : [
        PrometheusModule.register({
            path: '/metrics',
        }),
        LokiLoggerModule.forRootAsync({
            imports   : [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                lokiUrl     : configService.get('LOKI_URL'),
                labels      : {
                    "manual_logs": "simba-app",
                    "ctx": "app"
                },
                logToConsole: true,
                gzip        : false
            }),
            inject    : [ConfigService],
        }),
        AuthModule,
        DatabaseModule,
        PostModule,
        ConfigModule.forRoot({
            envFilePath: '../.env',
            isGlobal   : true,
        }),
        UsersModule,
    ],
    controllers: [
        AppController,
    ],
    providers  : [
        AppService
    ],
})
export class AppModule {
}

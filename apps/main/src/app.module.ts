import {Module}             from '@nestjs/common';
import {AppController}      from './app.controller';
import {AppService}         from './app.service';
import {AuthModule}         from './auth/auth.module';
import {DatabaseModule}     from './database/database.module';
import {PostModule}         from './post/post.module';
import {ConfigModule}       from '@nestjs/config';
import {UsersModule}        from './users/users.module';
import {HttpModule}         from "@nestjs/axios";
import {APP_INTERCEPTOR}    from "@nestjs/core";
import {LoggingInterceptor} from "./libs/logger/logging.interceptor";

@Module({
    imports    : [
        HttpModule.register({
            timeout     : 5000,
            maxRedirects: 5,
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
        AppService,
        {
            provide : APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {
}

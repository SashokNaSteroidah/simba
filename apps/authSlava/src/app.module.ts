import {
    Module,
}                               from '@nestjs/common';
import {AppController}          from './app.controller';
import {AppService}             from './app.service';
import {AuthModule}             from './auth/auth.module';
import {DatabaseModule}         from './database/database.module';
import {PostModule}             from './post/post.module';
import {ConfigModule}           from "@nestjs/config";
import {RedisIntegrationModule} from './redis-integration/redis-integration.module';
import {UsersModule}            from './users/users.module';

@Module({
    imports    : [
        AuthModule,
        DatabaseModule,
        PostModule,
        ConfigModule.forRoot({
            envFilePath: '../.env',
            isGlobal   : true,
        }),
        RedisIntegrationModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers  : [AppService],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(LoggerMiddleware).forRoutes('*');
    // }
}


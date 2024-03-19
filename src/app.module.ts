import {Module}         from '@nestjs/common';
import {AppController}  from './app.controller';
import {AppService}     from './app.service';
import {AuthModule}     from './auth/auth.module';
import {DatabaseModule} from './database/database.module';
import {PostModule}     from './post/post.module';
import {ConfigModule}   from "@nestjs/config";

@Module({
    imports    : [
            AuthModule,
            DatabaseModule,
            PostModule,
            ConfigModule.forRoot({
                isGlobal: true,
            })
        ],
    controllers: [AppController],
    providers  : [AppService],
})
export class AppModule {
}

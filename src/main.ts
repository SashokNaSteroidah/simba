import {NestFactory}     from '@nestjs/core';
import {AppModule}       from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        rawBody: true
    });
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(process.env.PORT);
}

bootstrap();

import {NestFactory} from '@nestjs/core';
import {AuthModule}  from './auth.module';
import {
    MicroserviceOptions,
    Transport
}                    from '@nestjs/microservices';
import {Logger}      from "@nestjs/common";

async function bootstrap() {
    const logger = new Logger()
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AuthModule,
        {
            transport: Transport.TCP,
            options  : {
                host: process.env.AUTH_HOST,
                port: +process.env.AUTH_PORT,
            },
        },
    );
    await app.listen();
}

bootstrap();

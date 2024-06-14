import {NestFactory} from '@nestjs/core';
import {AuthModule}  from './auth.module';
import tracer        from "./tracer";
import {
    MicroserviceOptions,
    Transport
}                    from '@nestjs/microservices';
import {Logger}      from "@nestjs/common";
import {mLog}        from "utils-nestjs";

async function bootstrap() {
    await tracer.start()
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
    logger.debug(`Service started at ${process.env.AUTH_HOST}:${process.env.AUTH_PORT}`)
    await app.listen();
}

bootstrap();

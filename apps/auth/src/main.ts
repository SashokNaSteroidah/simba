import tracer        from "./tracer";
import {NestFactory} from '@nestjs/core';
import {AuthModule}  from './auth.module';
import {
    MicroserviceOptions,
    Transport
}                    from '@nestjs/microservices';
import {Logger}      from "@nestjs/common";
import * as Pyroscope from "@pyroscope/nodejs";
import {pyroConfigAuth} from "./pyro/config";

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
    Pyroscope.init(pyroConfigAuth);
    Pyroscope.start()
    logger.debug(`Service started at ${process.env.AUTH_HOST}:${process.env.AUTH_PORT}`)
    await app.listen();
}

bootstrap();

import {NestFactory} from '@nestjs/core';
import {AuthModule}  from './auth.module';
import tracer        from "./tracer";
import {
    MicroserviceOptions,
    Transport
}                    from '@nestjs/microservices';
import {config}      from "../../../conf";

async function bootstrap() {
    await tracer.start()
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AuthModule,
        {
            transport: Transport.TCP,
            options  : {
                host: config.GENERAL.auth_host,
                port: +config.GENERAL.auth_port,
            },
        },
    );
    await app.listen();
}

bootstrap();

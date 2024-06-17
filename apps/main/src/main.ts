import tracer            from "./tracer";
import {NestFactory}     from '@nestjs/core';
import {AppModule}       from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dns          from 'dns';
import {config}          from "../../../conf";
import {
    mLog
}                        from "utils-nestjs";
import {Logger}          from "@nestjs/common";
import {LoggingInterceptor} from "./libs/logger/logging.interceptor";

dns.setDefaultResultOrder('ipv4first');

async function bootstrap(): Promise<void> {
    await tracer.start()
    const logger = new Logger()
    const app    = await NestFactory.create(AppModule, {
        rawBody: true,
    });
    mLog.config({
        objectToLog       : false,
        disableColor      : true,
        formatString      : true,
        disableBrackets   : true,
        spacesInJson      : 0,
        setSourceByDefault: false
    })
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(config.GENERAL.main_port, () => logger.debug(`App is started ${config.GENERAL.main_host}:${config.GENERAL.main_port}`));
}

bootstrap();

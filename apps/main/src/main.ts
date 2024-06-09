import {NestFactory}     from '@nestjs/core';
import {AppModule}       from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dns          from 'dns';
import {config}          from "../../../conf";
import {
    LoggingInterceptor,
    mLog
}                        from "utils-nestjs";
import {Logger}          from "@nestjs/common";
import tracer            from "./tracer";
dns.setDefaultResultOrder('ipv4first');

async function bootstrap(): Promise<void> {
    const logger = new Logger()
    const app    = await NestFactory.create(AppModule, {
        rawBody: true,
    });
    await tracer.start()
    mLog.config({
        objectToLog       : false,
        disableColor      : true,
        formatString      : true,
        disableBrackets   : true,
        spacesInJson      : 0,
        setSourceByDefault: false
    })
    app.useGlobalInterceptors(new LoggingInterceptor())
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(config.GENERAL.main_port, () => logger.log(mLog.log({message: `App is started ${config.GENERAL.main_host}:${config.GENERAL.main_port}`})));
}

bootstrap();

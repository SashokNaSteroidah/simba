import tracer            from "./tracer";
import {NestFactory}     from '@nestjs/core';
import {AppModule}       from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dns          from 'dns';
import {
    mLog
}                        from "utils-nestjs";
import {Logger}          from "@nestjs/common";
import * as Pyroscope from "@pyroscope/nodejs"
import {pyroConfigMain}  from "./pyro/config";

dns.setDefaultResultOrder('ipv4first');

async function bootstrap(): Promise<void> {
    await tracer.start()
    const logger = new Logger()
    const app    = await NestFactory.create(AppModule, {
        rawBody: true,
    });
    Pyroscope.init(pyroConfigMain);
    Pyroscope.start()
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
    await app.listen(process.env.MAIN_PORT, () => logger.debug(`App is started ${process.env.MAIN_HOST}:${process.env.MAIN_PORT}`));
}

bootstrap();

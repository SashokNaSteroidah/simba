import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dns from 'dns';
import {config} from "../../../conf";
dns.setDefaultResultOrder('ipv4first');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(config.GENERAL.main_port, () =>
    console.log(`App is started ${config.GENERAL.main_host}:${config.GENERAL.main_port}`),
  );
}

bootstrap();

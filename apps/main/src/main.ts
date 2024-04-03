import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT, process.env.HOST, () =>
    console.log(`App is listening ${process.env.HOST}:${process.env.PORT}`),
  );
}

bootstrap();

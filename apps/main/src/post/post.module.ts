import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { DatabaseModule } from '../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {config} from "../../../../conf";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.TCP,
        options: {
          host: config.GENERAL.auth_host,
          port: +config.GENERAL.auth_port,
        },
      },
    ]),
    DatabaseModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

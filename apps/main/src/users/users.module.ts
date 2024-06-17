import {Module}             from '@nestjs/common';
import {UsersController}    from './users.controller';
import {UsersService}       from './users.service';
import {DatabaseModule}     from '../database/database.module';
import {
    ClientsModule,
    Transport
}                           from '@nestjs/microservices';
import {config}             from "../../../../conf";
import {APP_INTERCEPTOR}    from "@nestjs/core";
import {LoggingInterceptor} from "../libs/logger/logging.interceptor";

@Module({
    imports    : [
        ClientsModule.register([
            {
                name     : 'auth',
                transport: Transport.TCP,
                options  : {
                    host: config.GENERAL.auth_host,
                    port: +config.GENERAL.auth_port,
                },
            },
        ]),
        DatabaseModule,
    ],
    controllers: [UsersController],
    providers  : [
        UsersService,
        {
            provide : APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class UsersModule {
}

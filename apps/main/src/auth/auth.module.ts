import {Module}             from '@nestjs/common';
import {AuthController}     from './auth.controller';
import {AuthService}        from './auth.service';
import {JwtModule}          from '@nestjs/jwt';
import {
    ClientsModule,
    Transport
}                           from '@nestjs/microservices';
import {config}             from "../../../../conf";
import {APP_INTERCEPTOR}    from "@nestjs/core";
import {LoggingInterceptor} from "../libs/logger/logging.interceptor";

@Module({
    imports    : [
        JwtModule.register({
            global     : true,
            secret     : config.GENERAL.secret_for_jwt,
            signOptions: {expiresIn: '1800s'},
        }),
        ClientsModule.register([
            {
                name     : 'auth',
                transport: Transport.TCP,
                options  : {
                    host: config.GENERAL.auth_host,
                    port: 3002,
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers  : [
        AuthService,
        {
            provide : APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AuthModule {
}

import {Module}                 from '@nestjs/common';
import {AuthController}         from './auth.controller';
import {AuthService}            from './auth.service';
import {JwtModule}              from "@nestjs/jwt";
import {jwtConstants}           from "../libs/consts/jwtSecret.consts";
import {
    ClientsModule,
    Transport
}                               from "@nestjs/microservices";

@Module({
    imports    :
        [
            JwtModule.register({
                global     : true,
                secret     : jwtConstants.secret,
                signOptions: {expiresIn: '1800s'},
            }),
            ClientsModule.register([
                {
                    name     : "auth",
                    transport: Transport.TCP,
                    options  : {
                        port: 3002
                    }
                }
            ])
        ],
    controllers: [AuthController],
    providers  : [AuthService]
})
export class AuthModule {
}

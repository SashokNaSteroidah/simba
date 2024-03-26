import {Module}                 from '@nestjs/common';
import {AuthController}         from './auth.controller';
import {AuthService}            from './auth.service';
import {DatabaseModule}         from "../database/database.module";
import {JwtModule}              from "@nestjs/jwt";
import {jwtConstants}           from "../libs/consts/jwtSecret.consts";
import {RedisIntegrationModule} from "../redis-integration/redis-integration.module";

@Module({
    imports    :
        [
            RedisIntegrationModule,
            DatabaseModule,
            JwtModule.register({
                global     : true,
                secret     : jwtConstants.secret,
                signOptions: {expiresIn: '1800s'},
            })
        ],
    controllers: [AuthController],
    providers  : [AuthService]
})
export class AuthModule {
}

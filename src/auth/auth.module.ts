import {Module}                 from '@nestjs/common';
import {AuthController}         from './auth.controller';
import {AuthService}            from './auth.service';
import {DatabaseModule}         from "../database/database.module";
import {JwtModule}              from "@nestjs/jwt";
import {jwtConstants}           from "../guards/constants/constants";
import {RedisIntegrationModule} from "../redis-integration/redis-integration.module";

@Module({
    imports    :
        [
            RedisIntegrationModule,
            DatabaseModule,
            JwtModule.register({
                global     : true,
                secret     : jwtConstants.secret,
                signOptions: {expiresIn: '100000000000000000000000s'},
            })
        ],
    controllers: [AuthController],
    providers  : [AuthService]
})
export class AuthModule {
}

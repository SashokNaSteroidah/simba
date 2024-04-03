import {Module}                 from '@nestjs/common';
import {AuthController}         from './auth.controller';
import {AuthService}            from './auth.service';
import {JwtModule}              from "@nestjs/jwt";
import {RedisIntegrationModule} from "./redis-integration/redis-integration.module";
import { VerifierModule } from './verifier/verifier.module';
import {DatabaseModule}         from "./database/database.module";
import {jwtConstants}           from "./consts/jwtSecret.consts";

@Module({
    imports    : [
        RedisIntegrationModule,
        DatabaseModule,
        JwtModule.register({
            global     : true,
            secret     : jwtConstants.secret,
            signOptions: {expiresIn: '1800s'},
        }),
        VerifierModule
    ],
    controllers: [AuthController],
    providers  : [AuthService],
})
export class AuthModule {
}

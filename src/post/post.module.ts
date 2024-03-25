import {Module}         from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService}    from './post.service';
import {DatabaseModule} from "../database/database.module";
import {
    JwtModule,
}                       from "@nestjs/jwt";
import {jwtConstants}   from "../guards/constants/constants";
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
            }),
        ],
    controllers: [PostController],
    providers  : [PostService]
})
export class PostModule {
}

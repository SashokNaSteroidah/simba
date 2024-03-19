import {Module}         from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService}    from './post.service';
import {DatabaseModule} from "../database/database.module";
import {
    JwtModule,
}                       from "@nestjs/jwt";
import {jwtConstants}   from "../guards/constants/constants";

@Module({
    imports    :
        [
            DatabaseModule,
            JwtModule.register({
                global     : true,
                secret     : jwtConstants.secret,
                signOptions: {expiresIn: '100000000000000000000000s'},
            }),
        ],
    controllers: [PostController],
    providers  : [PostService]
})
export class PostModule {
}

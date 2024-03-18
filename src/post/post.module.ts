import {Module}         from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService}    from './post.service';
import {DatabaseModule} from "../database/database.module";

@Module({
    imports    : [DatabaseModule],
    controllers: [PostController],
    providers  : [PostService]
})
export class PostModule {
}

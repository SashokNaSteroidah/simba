import {Module}         from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService}    from './post.service';
import {DatabaseModule} from "../database/database.module";
import {
    ClientsModule,
    Transport
} from "@nestjs/microservices";

@Module({
    imports    :
        [
            ClientsModule.register([
                {
                    name     : "auth",
                    transport: Transport.TCP,
                    options  : {
                        port: 3002
                    }
                }
            ]),
            DatabaseModule,
        ],
    controllers: [PostController],
    providers  : [PostService]
})
export class PostModule {
}

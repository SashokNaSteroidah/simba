import {Module}                 from '@nestjs/common';
import {UsersController}        from './users.controller';
import {UsersService}           from './users.service';
import {DatabaseModule}         from "../database/database.module";
import {
    ClientsModule,
    Transport
}                               from "@nestjs/microservices";

@Module({
    imports    : [
        ClientsModule.register([
            {
                name     : "auth",
                transport: Transport.TCP,
                options  : {
                    port: 3002
                }
            }
        ]),
        DatabaseModule
    ],
    controllers: [UsersController],
    providers  : [UsersService]
})
export class UsersModule {
}

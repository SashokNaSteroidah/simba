import {
    HttpException,
    HttpStatus,
    Injectable,
}                             from '@nestjs/common';
import {users}                from '@prisma/client';
import {DEFAULT_SERVER_ERROR} from '../libs/consts/errors.consts';
import {DatabaseService}      from '../database/database.service';
import {
    PatchUserDto,
    PatchUserID
}                             from './types/patchUser.dto';
import {DefaultOkResponse}    from '../libs/response/defaultOkResponse.interfaces';
import {DefaultOkResponseDto} from '../libs/response/defaultOkResponse.dto';
import {
    httpMethods,
    mLog
}                             from "utils-nestjs";
import {LokiLogger}           from "nestjs-loki-logger";

@Injectable()
export class UsersService {

    private readonly logger = new LokiLogger(UsersService.name)

    constructor(
        private readonly databaseService: DatabaseService,
    ) {
    }

    async getUsers(): Promise<users[]> {
        try {
            const userList = await this.databaseService.users.findMany();
            this.logger.debug(mLog.log({
                method : httpMethods.GET,
                handler: this.getUsers.name,
                path   : "/api/users",
                message: "Successful get user list"
            }) as string)
            return userList
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.GET,
                handler: this.getUsers.name,
                path   : "/api/users",
                message: "error while getting users list"
            }) as string)
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async patchUsers(
        dto: PatchUserDto,
        params: PatchUserID,
    ): Promise<DefaultOkResponse> {
        try {
            await this.databaseService.users.update({
                where: {
                    id: params.id,
                },
                data : {
                    role: dto.role,
                },
            });
            this.logger.debug(mLog.log({
                method : httpMethods.PATCH,
                handler: this.patchUsers.name,
                path   : "/api/users",
                message: "successfully patch user"
            }) as string)
            return DefaultOkResponseDto;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.PATCH,
                handler: this.patchUsers.name,
                path   : "/api/users",
                message: "error while update user"
            }) as string)
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }
}

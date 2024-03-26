import {
    HttpException,
    HttpStatus,
    Injectable
}                             from '@nestjs/common';
import {
    users
}                             from "@prisma/client";
import {DEFAULT_SERVER_ERROR} from "../libs/consts/errors.consts";
import {DatabaseService}      from "../database/database.service";
import {
    PatchUserDto,
    PatchUserID
} from "./types/patchUser.dto";

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {
    }
    async getUsers(): Promise<users[]> {
        try {
            return await this.databaseService.users.findMany()
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async patchUsers(dto: PatchUserDto, params: PatchUserID): Promise<string> {
        try {
            await this.databaseService.users.update({
                where: {
                    id: params.id
                },
                data: {
                    role: dto.role,
                }
            })
            return "OK"
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }
}

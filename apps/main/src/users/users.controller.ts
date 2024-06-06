import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Patch,
    UseGuards,
    UsePipes,
    ValidationPipe,
}                          from '@nestjs/common';
import {
    Roles,
    users
}                          from '@prisma/client';
import {UsersService}      from './users.service';
import {RolesGuardDecor}   from '../libs/decorators/roles.decorator';
import {AuthGuard}         from '../libs/guards/auth/auth.guard';
import {RolesGuard}        from '../libs/guards/roles/roles.guard';
import {
    PatchUserDto,
    PatchUserID
}                          from './types/patchUser.dto';
import {DefaultOkResponse} from '../libs/response/defaultOkResponse.interfaces';
import {
    httpMethods,
    mLog
}                          from "utils-nestjs";

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly logger = new Logger(UsersController.name)
    ) {
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get()
    async getUsers(): Promise<users[]> {
        this.logger.log(mLog.log({
            method : httpMethods.GET,
            handler: this.getUsers.name,
            path   : "/api/users",
            message: "Getting user list..."
        }))
        return await this.userService.getUsers();
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patchUsers(
        @Body() dto: PatchUserDto,
        @Param() params: PatchUserID,
    ): Promise<DefaultOkResponse> {
        this.logger.log(mLog.log({
            info: JSON.stringify(dto),
            method : httpMethods.GET,
            handler: this.getUsers.name,
            path   : "/api/users",
            message: `Patch user ${params?.id} ...`
        }))
        return await this.userService.patchUsers(dto, params);
    }
}

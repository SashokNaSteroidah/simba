import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {
    Roles,
    users
} from "@prisma/client";
import {UsersService}    from "./users.service";
import {RolesGuardDecor} from "../libs/decorators/roles.decorator";
import {AuthGuard}       from "../libs/guards/auth/auth.guard";
import {RolesGuard}      from "../libs/guards/roles/roles.guard";
import {
    PatchUserDto,
    PatchUserID
}                          from "./types/patchUser.dto";
import {DefaultOkResponse} from "../libs/response/defaultOkResponse.interfaces";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get()
    async getUsers(): Promise<users[]> {
        return await this.userService.getUsers()
    }
    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Patch(":id")
    async patchUsers(@Body() dto: PatchUserDto, @Param() params: PatchUserID): Promise<DefaultOkResponse> {
        return await this.userService.patchUsers(dto, params)
    }


}

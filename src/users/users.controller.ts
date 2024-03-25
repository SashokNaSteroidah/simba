import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    UseGuards
} from '@nestjs/common';
import {
    Roles,
    users
} from "@prisma/client";
import {UsersService}    from "./users.service";
import {RolesGuardDecor} from "../decorators/roles.decorator";
import {AuthGuard}       from "../guards/auth/auth.guard";
import {RolesGuard}      from "../guards/roles/roles.guard";
import {
    PatchUserDto,
    PatchUserID
} from "./types/patchUser.dto";

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
    @Patch(":id")
    async patchUsers(@Body() dto: PatchUserDto, @Param() params: PatchUserID): Promise<string> {
        return await this.userService.patchUsers(dto, params)
    }


}

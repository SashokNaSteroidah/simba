import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthService}             from "./auth.service";
import {AuthCreateUserDto}       from "./types/authCreateUser.dto";
import {AuthAuthenticateUserDTO} from "./types/authAuthenticateUser.dto";
import {
    Request,
    Response
} from "express";
import {RolesGuardDecor} from "../libs/decorators/roles.decorator";
import {Roles}           from "@prisma/client";
import {AuthGuard}       from "../libs/guards/auth/auth.guard";
import {RolesGuard}      from "../libs/guards/roles/roles.guard";
import {TokensType}      from "./types/tokens.type";
import {RefreshTokenDto}         from "./types/refreshToken.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(new ValidationPipe())
    @Post("login")
    async loginUser(@Body() dto: AuthAuthenticateUserDTO, @Res({passthrough: true}) response: Response): Promise<string> {
        return await this.authService.loginUser(dto, response);
    }

    @UsePipes(new ValidationPipe())
    @Post("registration")
    registerUser(@Body() dto: AuthCreateUserDto): Promise<string> {
        return this.authService.registerUser(dto);
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get("tokens")
    getTokens(): Promise<TokensType[]> {
        return this.authService.getTokens();
    }

    @Post("refresh-token")
    refreshToken(@Body() dto: RefreshTokenDto, @Res({passthrough: true}) res: Response): Promise<string> {
        return this.authService.refreshToken(dto, res);
    }
}

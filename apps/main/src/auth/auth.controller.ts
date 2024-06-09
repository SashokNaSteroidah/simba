import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
}                                from '@nestjs/common';
import {AuthService}             from './auth.service';
import {AuthCreateUserDto}       from './types/authCreateUser.dto';
import {AuthAuthenticateUserDTO} from './types/authAuthenticateUser.dto';
import {Response}                from 'express';
import {RolesGuardDecor}         from '../libs/decorators/roles.decorator';
import {Roles}                   from '@prisma/client';
import {AuthGuard}               from '../libs/guards/auth/auth.guard';
import {RolesGuard}              from '../libs/guards/roles/roles.guard';
import {TokensType}              from './types/tokens.type';
import {RefreshTokenDto}         from './types/refreshToken.dto';
import {LoginResponceDto}        from './types/loginResponce.dto';
import {RegResponceDto}          from './types/regResponce.dto';
import {DefaultOkResponse}       from '../libs/response/defaultOkResponse.interfaces';
import {
    httpMethods,
    mLog
}                                from "utils-nestjs";

@Controller('auth')
export class AuthController {

    private readonly logger = new Logger(AuthController.name)
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    async loginUser(
        @Body() dto: AuthAuthenticateUserDTO,
        @Res({passthrough: true}) response: Response,
    ): Promise<LoginResponceDto> {
        this.logger.log(mLog.log({
            info   : JSON.stringify(dto),
            method : httpMethods.POST,
            handler: this.loginUser.name,
            path   : "/api/login",
            message: "Logging request..."
        }))
        return await this.authService.loginUser(dto, response);
    }

    @UsePipes(new ValidationPipe())
    @Post('registration')
    registerUser(@Body() dto: AuthCreateUserDto): Promise<RegResponceDto> {
        this.logger.log(mLog.log({
            info   : JSON.stringify(dto),
            method : httpMethods.POST,
            handler: this.registerUser.name,
            path   : "/api/registration",
            message: "Registration request..."
        }))
        return this.authService.registerUser(dto);
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get('tokens')
    getTokens(): Promise<TokensType[]> {
        this.logger.log(mLog.log({
            method : httpMethods.GET,
            handler: this.getTokens.name,
            path   : "/api/tokens",
            message: "Getting user tokens..."
        }))
        return this.authService.getTokens();
    }

    @UsePipes(new ValidationPipe())
    @Post('refresh')
    refreshToken(
        @Body() dto: RefreshTokenDto,
        @Res({passthrough: true}) res: Response,
    ): Promise<DefaultOkResponse> {
        this.logger.log(mLog.log({
            info   : JSON.stringify(dto),
            method : httpMethods.POST,
            handler: this.refreshToken.name,
            path   : "/api/refresh",
            message: "Refreshing token..."
        }))
        return this.authService.refreshToken(dto, res);
    }
}

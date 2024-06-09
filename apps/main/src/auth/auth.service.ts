import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger
}                                from '@nestjs/common';
import {Response}                from 'express';
import {AuthAuthenticateUserDTO} from './types/authAuthenticateUser.dto';
import {ClientProxy}             from '@nestjs/microservices';
import {
    DEFAULT_BAD_REQUEST_ERROR,
    DEFAULT_SERVER_ERROR,
}                                from '../libs/consts/errors.consts';
import {LoginUserEventDto}       from '../../../auth/src/types/events/loginUserEvent.dto';
import {
    firstValueFrom,
    Observable
}                                from 'rxjs';
import {TokensType}              from './types/tokens.type';
import {RefreshTokenDto}         from './types/refreshToken.dto';
import {AuthCreateUserDto}       from './types/authCreateUser.dto';
import {LoginResponceDto}        from './types/loginResponce.dto';
import {RegResponceDto}          from './types/regResponce.dto';
import {DefaultOkResponseDto}    from '../libs/response/defaultOkResponse.dto';
import {DefaultOkResponse}       from '../libs/response/defaultOkResponse.interfaces';
import {
    httpMethods,
    mLog
}                                from "utils-nestjs";

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name)
    constructor(
        @Inject('auth') private readonly communicationClient: ClientProxy,
    ) {
    }

    async loginUser(
        dto: AuthAuthenticateUserDTO,
        response: Response,
    ): Promise<LoginResponceDto> {
        try {
            const data: Observable<LoginUserEventDto> = this.communicationClient.send(
                'login',
                dto,
            );
            this.logger.debug(mLog.log({
                method : httpMethods.POST,
                handler: this.loginUser.name,
                path   : "/api/login",
                message: "Event send to auth service"
            }))
            const event: LoginUserEventDto | null = await firstValueFrom(data);
            if (!event) {
                this.logger.error(mLog.log({
                    error  : "Invalid params",
                    method : httpMethods.POST,
                    handler: this.loginUser.name,
                    path   : "/api/login",
                    message: "Event don't received from auth service"
                }))
                throw new Error();
            }
            const accessToken: string  = event.accessToken;
            const refreshToken: string = event.refreshToken;
            this.logger.debug(mLog.log({
                info   : JSON.stringify({
                    accessToken : accessToken,
                    refreshToken: refreshToken
                }),
                method : httpMethods.POST,
                handler: this.loginUser.name,
                path   : "/api/login",
                message: "Refresh and access tokens received from auth service"
            }))
            response.cookie('Cookie', accessToken);
            return {
                refreshToken: refreshToken,
            };
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.POST,
                handler: this.loginUser.name,
                path   : "/api/login",
                message: "Error while logging"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async registerUser(dto: AuthCreateUserDto): Promise<RegResponceDto> {
        try {
            const data: Observable<RegResponceDto> = this.communicationClient.send(
                'registration',
                dto,
            );
            this.logger.debug(mLog.log({
                method : httpMethods.POST,
                handler: this.registerUser.name,
                path   : "/api/registration",
                message: "Event send to auth service"
            }))
            return await firstValueFrom(data);
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.POST,
                handler: this.registerUser.name,
                path   : "/api/registration",
                message: "Error while registering"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async getTokens(): Promise<TokensType[]> {
        try {
            const data: Observable<TokensType[]> = this.communicationClient.send(
                'get_tokens',
                'request',
            );
            this.logger.debug(mLog.log({
                method : httpMethods.GET,
                handler: this.getTokens.name,
                path   : "/api/tokens",
                message: "Event send to auth service"
            }))
            return await firstValueFrom(data);
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.GET,
                handler: this.getTokens.name,
                path   : "/api/tokens",
                message: "Error while getting tokens"
            }))
            throw new HttpException(
                DEFAULT_BAD_REQUEST_ERROR,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async refreshToken(
        dto: RefreshTokenDto,
        response: Response,
    ): Promise<DefaultOkResponse> {
        try {
            const data: Observable<string> = this.communicationClient.send(
                'refresh_token',
                dto,
            );
            this.logger.debug(mLog.log({
                method : httpMethods.POST,
                handler: this.refreshToken.name,
                path   : "/api/refresh_token",
                message: "Event send to auth service"
            }))
            const cookie = await firstValueFrom(data);
            this.logger.debug(mLog.log({
                info   : JSON.stringify({
                    accessToken : cookie
                }),
                method : httpMethods.POST,
                handler: this.refreshToken.name,
                path   : "/api/refresh_token",
                message: "Get access token from auth service"
            }))
            response.cookie('Cookie', cookie);
            return DefaultOkResponseDto;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.POST,
                handler: this.refreshToken.name,
                path   : "/api/refresh_token",
                message: "Error while refreshing access token"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }
}

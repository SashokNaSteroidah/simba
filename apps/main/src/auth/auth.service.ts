import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
}                                  from '@nestjs/common';
import {
    Response
}                                  from "express";
import {AuthAuthenticateUserDTO}   from "./types/authAuthenticateUser.dto";
import {ClientProxy}       from "@nestjs/microservices";
import {
    DEFAULT_BAD_REQUEST_ERROR,
    DEFAULT_SERVER_ERROR
}                          from "../libs/consts/errors.consts";
import {LoginUserEventDto} from "../../../auth/src/types/events/loginUserEvent.dto";
import {
    firstValueFrom,
    Observable
}                                  from "rxjs";
import {TokensType}                from "./types/tokens.type";
import {RefreshTokenDto}           from "./types/refreshToken.dto";
import {Prisma}                    from "@prisma/client";
import {AuthCreateUserDto}         from "./types/authCreateUser.dto";
import {LoginResponceDto}          from "./types/loginResponce.dto";
import {RegResponceDto}            from "./types/regResponce.dto";
import {DefaultOkResponseDto}      from "../libs/response/defaultOkResponse.dto";
import {DefaultOkResponse}         from "../libs/response/defaultOkResponse.interfaces";

@Injectable()
export class AuthService {
    constructor(@Inject("auth") private readonly communicationClient: ClientProxy) {
    }

    async loginUser(dto: AuthAuthenticateUserDTO, response: Response): Promise<LoginResponceDto> {
        try {
            const data: Observable<LoginUserEventDto> = this.communicationClient.send("login", dto);
            const event: LoginUserEventDto | null           = await firstValueFrom(data)
            if (!event){
                throw new Error()
            }
            const accessToken: string                         = event.accessToken;
            const refreshToken: string                        = event.refreshToken;
            response.cookie("Cookie", accessToken);
            return {
                refreshToken: refreshToken
            };
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async registerUser(dto: AuthCreateUserDto): Promise<RegResponceDto> {
        try {
            const data: Observable<RegResponceDto> = this.communicationClient.send("registration", dto);
            return await firstValueFrom(data)
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async getTokens(): Promise<TokensType[]> {
        try {
            const data: Observable<TokensType[]> = this.communicationClient.send("get_tokens", "request");
            return await firstValueFrom(data)
        } catch (e) {
            throw new HttpException(DEFAULT_BAD_REQUEST_ERROR, HttpStatus.BAD_REQUEST)
        }
    }

    async refreshToken(dto: RefreshTokenDto, response: Response): Promise<DefaultOkResponse> {
        try {
            const data: Observable<string> = this.communicationClient.send("refresh_token", dto);
            const cookie                   = await firstValueFrom(data)
            response.cookie("Cookie", cookie)
            return DefaultOkResponseDto
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }
}

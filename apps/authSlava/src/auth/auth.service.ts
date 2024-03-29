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
import {ClientProxy}               from "@nestjs/microservices";
import {DEFAULT_BAD_REQUEST_ERROR} from "../libs/consts/errors.consts";
import {LoginUserEventDto}         from "../../../auth/src/types/events/loginUserEvent.dto";
import {
    firstValueFrom,
    Observable
}                                  from "rxjs";
import {TokensType}                from "./types/tokens.type";
import {RefreshTokenDto}           from "./types/refreshToken.dto";
import {Prisma}                    from "@prisma/client";
import {AuthCreateUserDto}         from "./types/authCreateUser.dto";

@Injectable()
export class AuthService {
    constructor(@Inject("auth") private readonly communicationClient: ClientProxy) {
    }

    async loginUser(dto: AuthAuthenticateUserDTO, response: Response): Promise<unknown> {
        try {
            const data: Observable<LoginUserEventDto> = this.communicationClient.send("login", dto);
            const event: LoginUserEventDto            = await firstValueFrom(data)
            const accessToken                         = event.accessToken;
            const refreshToken                        = event.refreshToken;
            response.cookie("Cookie", accessToken);
            return refreshToken;
        } catch (e) {
            throw new HttpException(DEFAULT_BAD_REQUEST_ERROR, HttpStatus.BAD_REQUEST);
        }
    }

    async registerUser(dto: AuthCreateUserDto): Promise<string> {
        try {
            const data: Observable<string> = this.communicationClient.send("registration", dto);
            return await firstValueFrom(data)
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new HttpException('There is a unique constraint violation, a new user cannot be created with this email or name', HttpStatus.BAD_REQUEST);
                }
            }
            throw e
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

    async refreshToken(dto: RefreshTokenDto, response: Response): Promise<string> {
        try {
            const data: Observable<string> = this.communicationClient.send("refresh_token", dto);
            const cookie                   = firstValueFrom(data)
            response.cookie("Cookie", cookie)
            return "OK"
        } catch (e) {
            throw new HttpException(DEFAULT_BAD_REQUEST_ERROR, HttpStatus.BAD_REQUEST)
        }
    }
}

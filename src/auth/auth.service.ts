import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
}                                from '@nestjs/common';
import {DatabaseService}         from "../database/database.service";
import {AuthCreateUserDto}       from "./types/authCreateUser.dto";
import * as bcrypt               from 'bcrypt';
import {
    Prisma,
    Roles
}                                from "@prisma/client";
import {AuthAuthenticateUserDTO} from "./types/authAuthenticateUser.dto";
import {JwtService}              from "@nestjs/jwt";
import {RedisIntegrationService} from "../redis-integration/redis-integration.service";
import {TokensType}              from "./types/tokens.type";
import {RefreshTokenDto}         from "./types/refreshToken.dto";
import {DEFAULT_BAD_REQUEST_ERROR} from "../libs/consts/errors.consts";
import {Response} from "express";

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService, private readonly redis: RedisIntegrationService) {
    }

    async setToRedisNewToken(username: string, token: string): Promise<unknown> {
        const redisUniqueKey = `accessToken_${username}_${Math.random().toString(36).substring(2, 9)}`
        try {
            await this.redis.set(redisUniqueKey, token)
            await this.redis.expire(redisUniqueKey, 1800)
        } catch (e) {
            console.error("Redis error: " + e.message)
        }
        return true
    }

    async loginUser(dto: AuthAuthenticateUserDTO, response: Response): Promise<string> {
        try {
            const user = await this.databaseService.users.findFirst({where: {name: dto.name}})
            const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.password.trim())
            if (!isPasswordValid) {
                throw new UnauthorizedException();
            }
            const payload = {
                id      : user.id,
                username: user.name,
                role    : user.role
            };
            const nameFromRedis = await this.redis.keys(`*_${user.name}_*`)
            if (nameFromRedis.length === 0) {
                const token   = await this.jwtService.signAsync(payload)
                await this.setToRedisNewToken(user.name, token)
                const refreshToken   = await this.jwtService.signAsync(payload)
                await this.databaseService.tokens.create({
                    data: {
                        token: refreshToken,
                        client_name: dto.name,
                        expires_at: new Date().setMonth(2).toString(),
                    }
                })
                response.cookie("Cookie", token)
                return refreshToken
            } else {
                const tokensFromRedis = await this.redis.get(nameFromRedis[0])
                const data = await this.databaseService.tokens.findFirst({where: {client_name: dto.name}})
                if (!data) {
                    const refreshToken   = await this.jwtService.signAsync(payload)
                    await this.databaseService.tokens.create({
                        data: {
                            token: refreshToken,
                            client_name: dto.name,
                            expires_at: new Date().setMonth(2).toString(),
                        }
                    })
                    return refreshToken
                }
                response.cookie("Cookie", tokensFromRedis)
                return data.token
            }
        } catch (e) {
            if (e.status === 401) {
                throw new HttpException("This users doesn't exist", HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Unexpected user scenario", HttpStatus.BAD_REQUEST);
        }
    }

    async registerUser(dto: AuthCreateUserDto): Promise<string> {
        try {
            const saltOrRounds = 10;
            const hash         = await bcrypt.hash(dto.password, saltOrRounds);

            await this.databaseService.users.create({
                data: {
                    id      : crypto.randomUUID(),
                    name    : dto.name,
                    password: hash,
                    role    : Roles.user,
                    email   : dto.email
                }
            })
            return "OK"
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                    throw new HttpException('There is a unique constraint violation, a new user cannot be created with this email or name', HttpStatus.BAD_REQUEST);
                }
            }
            throw e
        }
    }

    async getTokens(): Promise<TokensType[]> {
        const keys = await this.redis.keys("*");
        return await Promise.all(keys.map(async key => {
            const token = await this.redis.get(key);
            return {
                key,
                token
            };
        }));
    }

    async refreshToken(dto: RefreshTokenDto, response: Response): Promise<string> {
        try {
            const dataFromDB = await this.databaseService.tokens.findFirst({where: {token: dto.refreshToken}})
            if (dataFromDB) {
                const user = await this.databaseService.users.findFirst({where: {name: dataFromDB.client_name}})
                const payload = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role
                };
                const nameFromRedis = await this.redis.keys(`*_${user.name}_*`)
                if (nameFromRedis.length !== 0) {
                    await this.redis.del(nameFromRedis[0])
                }
                const token   = await this.jwtService.signAsync(payload)
                await this.setToRedisNewToken(user.name, token)
                response.cookie("Cookie", token)
                return "OK"
            }
            throw new Error()
        } catch (e) {
            throw new HttpException(DEFAULT_BAD_REQUEST_ERROR, HttpStatus.BAD_REQUEST)
        }
    }
}

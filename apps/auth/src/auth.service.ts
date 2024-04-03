import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
}                                  from "@nestjs/common";
import {DatabaseService}           from "./database/database.service";
import {JwtService}                from "@nestjs/jwt";
import {RedisIntegrationService}   from "./redis-integration/redis-integration.service";
import {DEFAULT_BAD_REQUEST_ERROR} from "./consts/errors.consts";
import * as bcrypt                 from 'bcrypt';

import {
    Prisma,
    Roles
}                                from "@prisma/client";
import {TokensType}              from "./types/tokens.type";
import {RefreshTokenDto}         from "./types/refreshToken.dto";
import {AuthCreateUserDto}       from "./types/authCreateUser.dto";
import {AuthAuthenticateUserDTO} from "./types/authAuthenticateUser.dto";
import {LoginUserEventDto}       from "./types/events/loginUserEvent.dto";
import {RegResponceDto}          from "../../main/src/auth/types/regResponce.dto";

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
            return false
        }
        return true
    }

    async loginUser(dto: AuthAuthenticateUserDTO): Promise<LoginUserEventDto> {
        try {
            const user                     = await this.databaseService.users.findFirst({where: {name: dto.name}})
            const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.password.trim())
            if (!isPasswordValid) {
                return null
            }
            const nameFromRedis = await this.redis.keys(`*_${user.name}_*`)
            const data          = await this.databaseService.tokens.findFirst({where: {client_name: dto.name}})
            if (nameFromRedis.length === 0 && !data) {
                const payload      = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role
                };
                const token        = await this.jwtService.signAsync(payload)
                const refreshToken = await this.jwtService.signAsync(payload)
                await this.setToRedisNewToken(user.name, token)
                await this.databaseService.tokens.create({
                    data: {
                        token      : refreshToken,
                        client_name: dto.name,
                        expires_at : new Date()
                    }
                })
                return {
                    accessToken : token,
                    refreshToken: refreshToken
                }
            }
            if (nameFromRedis.length === 0) {
                const payload     = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role
                };
                const accessToken = await this.jwtService.signAsync(payload)
                await this.setToRedisNewToken(user.name, accessToken)
                return {
                    accessToken : accessToken,
                    refreshToken: data.token
                }
            }
            const tokensFromRedis = await this.redis.get(nameFromRedis[0])
            if (!data) {
                const payload      = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role
                };
                const refreshToken = await this.jwtService.signAsync(payload)
                await this.databaseService.tokens.create({
                    data: {
                        token      : refreshToken,
                        client_name: dto.name,
                        expires_at : new Date()
                    }
                })
                return {
                    accessToken : tokensFromRedis,
                    refreshToken: refreshToken
                }
            }
            return {
                accessToken : tokensFromRedis,
                refreshToken: data.token
            }
        } catch (e) {
            return null
        }
    }

    async regUser(dto: AuthCreateUserDto): Promise<RegResponceDto> {
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
            return {
                success: true
            }
        } catch (e) {
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

    async refreshToken(dto: RefreshTokenDto): Promise<string> {
        try {
            const dataFromDB = await this.databaseService.tokens.findFirstOrThrow({where: {token: dto.refreshToken}})
            if (dataFromDB) {
                const user          = await this.databaseService.users.findFirstOrThrow({where: {name: dataFromDB.client_name}})
                const payload       = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role
                };
                const nameFromRedis = await this.redis.keys(`*_${user.name}_*`)
                if (nameFromRedis.length !== 0) {
                    await this.redis.del(nameFromRedis[0])
                }
                const token = await this.jwtService.signAsync(payload)
                await this.setToRedisNewToken(user.name, token)
                return token
            }
            return null
        } catch (e) {
            return null
        }
    }
}

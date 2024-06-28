import {
    Injectable,
    Logger
}                                from '@nestjs/common';
import {DatabaseService}         from './database/database.service';
import {JwtService}              from '@nestjs/jwt';
import {RedisIntegrationService} from './redis-integration/redis-integration.service';
import * as bcrypt               from 'bcrypt';
import {Roles}                   from '@prisma/client';
import {TokensType}              from './types/tokens.type';
import {RefreshTokenDto}         from './types/refreshToken.dto';
import {AuthCreateUserDto}       from './types/authCreateUser.dto';
import {AuthAuthenticateUserDTO} from './types/authAuthenticateUser.dto';
import {LoginUserEventDto}       from './types/events/loginUserEvent.dto';
import {RegResponceDto}          from '../../main/src/auth/types/regResponce.dto';
import {
    mLog
}                                from "utils-nestjs";
import {LokiLogger}              from "nestjs-loki-logger";

@Injectable()
export class AuthService {

    private readonly logger = new LokiLogger(AuthService.name)
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly redis: RedisIntegrationService,
    ) {
    }

    async setToRedisNewToken(username: string, token: string): Promise<unknown> {
        const redisUniqueKey = `accessToken_${username}_${Math.random().toString(36).substring(2, 9)}`;
        this.logger.debug(mLog.log({
            info   : JSON.stringify({
                redisKey: redisUniqueKey,
                token   : token
            }),
            handler: this.setToRedisNewToken.name,
            message: "Generating new token name for redis"
        }) as string)
        const expireTime = 1800
        try {
            await this.redis.redisClient.set(redisUniqueKey, token);
            await this.redis.redisClient.expire(redisUniqueKey, expireTime);
            this.logger.debug(mLog.log({
                handler: this.setToRedisNewToken.name,
                message: `Token successfully add to redis with expiration time ${expireTime}`
            }) as string)
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.setToRedisNewToken.name,
                message: "Error while adding token to redis"
            }) as string)
            return false;
        }
        return true;
    }

    async loginUser(dto: AuthAuthenticateUserDTO): Promise<LoginUserEventDto> {
        try {
            const user                     = await this.databaseService.users.findFirst({
                where: {name: dto.name},
            });
            const isPasswordValid: boolean = await bcrypt.compare(
                dto.password,
                user.password.trim(),
            );
            if (!isPasswordValid) {
                return null;
            }
            const nameFromRedis = await this.redis.redisClient.keys(`*_${user.name}_*`);
            const data          = await this.databaseService.tokens.findFirst({
                where: {client_name: dto.name},
            });
            if (nameFromRedis.length === 0 && !data) {
                const payload      = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role,
                };
                const token        = await this.jwtService.signAsync(payload);
                const refreshToken = await this.jwtService.signAsync(payload);
                await this.setToRedisNewToken(user.name, token);
                await this.databaseService.tokens.create({
                    data: {
                        token      : refreshToken,
                        client_name: dto.name,
                        expires_at : new Date(),
                    },
                });
                this.logger.debug(mLog.log({
                    info   : JSON.stringify({
                        user        : user.id,
                        accessToken : token,
                        refreshToken: refreshToken,
                    }),
                    handler: this.loginUser.name,
                    path   : "tcp//login",
                    message: "Successfully get access and refresh tokens for user",
                }) as string)
                return {
                    accessToken : token,
                    refreshToken: refreshToken,
                };
            }
            if (nameFromRedis.length === 0) {
                const payload     = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role,
                };
                const accessToken = await this.jwtService.signAsync(payload);
                await this.setToRedisNewToken(user.name, accessToken);
                this.logger.debug(mLog.log({
                    info   : JSON.stringify({
                        user        : user.id,
                        accessToken : accessToken,
                        refreshToken: data.token,
                    }),
                    handler: this.loginUser.name,
                    path   : "tcp//login",
                    message: "Successfully get access and refresh tokens for user",
                }) as string)
                return {
                    accessToken : accessToken,
                    refreshToken: data.token,
                };
            }
            const tokensFromRedis = await this.redis.redisClient.get(nameFromRedis[0]);
            if (!data) {
                const payload      = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role,
                };
                const refreshToken = await this.jwtService.signAsync(payload);
                await this.databaseService.tokens.create({
                    data: {
                        token      : refreshToken,
                        client_name: dto.name,
                        expires_at : new Date(),
                    },
                });
                this.logger.debug(mLog.log({
                    info   : JSON.stringify({
                        user        : user.id,
                        accessToken : tokensFromRedis,
                        refreshToken: refreshToken,
                    }),
                    handler: this.loginUser.name,
                    path   : "tcp//login",
                    message: "Successfully get access and refresh tokens for user",
                }) as string)
                return {
                    accessToken : tokensFromRedis,
                    refreshToken: refreshToken,
                };
            }
            this.logger.debug(mLog.log({
                info   : JSON.stringify({
                    user        : user.id,
                    accessToken : tokensFromRedis,
                    refreshToken: data.token,
                }),
                handler: this.loginUser.name,
                path   : "tcp//login",
                message: "Successfully get access and refresh tokens for user",
            }) as string)
            return {
                accessToken : tokensFromRedis,
                refreshToken: data.token,
            };
        } catch (e) {
            this.logger.error(mLog.log({
                error  : e,
                handler: this.loginUser.name,
                path   : "tcp//login",
                message: "Error logging user",
            }) as string)
            return null;
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
                    email   : dto.email,
                },
            });
            this.logger.debug(mLog.log({
                handler: this.regUser.name,
                path   : "tcp//registration",
                message: "User successfully created"
            }) as string)
            return {
                success: true,
            };
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.regUser.name,
                path   : "tcp//registration",
                message: "Error while registering user"
            }) as string)
            throw e;
        }
    }

    async getTokens(): Promise<TokensType[]> {
        const keys = await this.redis.redisClient.keys('*');
        return await Promise.all(
            keys.map(async (key) => {
                const token = await this.redis.redisClient.get(key);
                return {
                    key,
                    token,
                };
            }),
        );
    }

    async refreshToken(dto: RefreshTokenDto): Promise<string> {
        try {
            const dataFromDB = await this.databaseService.tokens.findFirstOrThrow({
                where: {token: dto.refreshToken},
            });
            if (dataFromDB) {
                const user          = await this.databaseService.users.findFirstOrThrow({
                    where: {name: dataFromDB.client_name},
                });
                const payload       = {
                    id      : user.id,
                    username: user.name,
                    role    : user.role,
                };
                const nameFromRedis = await this.redis.redisClient.keys(`*_${user.name}_*`);
                if (nameFromRedis.length !== 0) {
                    await this.redis.redisClient.del(nameFromRedis[0]);
                }
                const token = await this.jwtService.signAsync(payload);
                await this.setToRedisNewToken(user.name, token);
                return token;
            }
            return null;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.refreshToken.name,
                path   : "tcp//refresh_token",
                message: "Error while refreshing token"
            }) as string)
            return null;
        }
    }
}

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
import {Response,}               from "express";
import {RedisIntegrationService} from "../redis-integration/redis-integration.service";
import {TokensType}              from "./types/tokens.type";

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService, private readonly redis: RedisIntegrationService) {
    }

    async loginUser(dto: AuthAuthenticateUserDTO, response: Response): Promise<string> {
        try {
            const user                     = await this.databaseService.users.findFirst({where: {name: dto.name}})
            const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.password.trim())
            if (!isPasswordValid) {
                throw new UnauthorizedException();
            }
            const payload = {
                id      : user.id,
                username: user.name,
                role    : user.role
            };
            const token   = await this.jwtService.signAsync(payload)
            const tokensFromRedis = await this.redis.keys(`*_${user.name}_*`)
            if (tokensFromRedis.length === 0) {
                const redisUniqueKey = `accessToken_${user.name}_${Math.random().toString(36).substring(2, 9)}`
                try {
                    await this.redis.set(redisUniqueKey, token)
                    await this.redis.expire(redisUniqueKey, 1800)
                } catch (e) {
                    console.error("Redis error: " + e.message)
                }
            }
            response.cookie("Cookie", token)
            return "OK"
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
}

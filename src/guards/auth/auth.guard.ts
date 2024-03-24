import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import {JwtService}      from "@nestjs/jwt";
import {jwtConstants}    from "../constants/constants";
import {RedisIntegrationService} from "../../redis-integration/redis-integration.service";
import {DEFAULT_UNAUTHORIZED_ERROR} from "../../consts/errors.consts";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly redis: RedisIntegrationService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token   = request.headers.cookie;
        const cookie = token.split('; ').find((item: string) => item.startsWith('Cookie='));
        const cookieValue = cookie.split('=')[1]
        if (!cookieValue) {
            return false
        }
        try {
            const payload = request['user'] = await this.jwtService.verifyAsync(
                cookieValue,
                {
                    secret: jwtConstants.secret
                }
            );
            // const tokens = await this.redis.keys("*");
            // console.log(await Promise.all(tokens.map(async tok => await this.redis.get(tok))));
            const user = await this.redis.keys(`*${payload.username}*`)
            const tokenFromRedis = await this.redis.get(user[0])
            if (tokenFromRedis === null) {
                throw new Error()
            }
            const tokenIsValid = tokenFromRedis === cookieValue
            if (!tokenIsValid) {
                throw new Error()
            }
            return true
        } catch {
            throw new HttpException(DEFAULT_UNAUTHORIZED_ERROR, HttpStatus.UNAUTHORIZED);
        }
    }
}

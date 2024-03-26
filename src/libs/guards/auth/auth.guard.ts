import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
}                                   from '@nestjs/common';
import {JwtService}                 from "@nestjs/jwt";
import {jwtConstants}               from "../../consts/jwtSecret.consts";
import {RedisIntegrationService}    from "../../../redis-integration/redis-integration.service";
import {DEFAULT_UNAUTHORIZED_ERROR} from "../../consts/errors.consts";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly redis: RedisIntegrationService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request     = context.switchToHttp().getRequest();
            const token       = request.headers.cookie;
            const cookie      = token.split('; ').find((item: string) => item.startsWith('Cookie='));
            const cookieValue = cookie.split('=')[1]
            if (!cookieValue) {
                return false
            }
            const payload = request['user'] = await this.jwtService.verifyAsync(
                cookieValue,
                {
                    secret: jwtConstants.secret
                }
            );
            const user           = await this.redis.keys(`*_${payload.username}_*`)
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
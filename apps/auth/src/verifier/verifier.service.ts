import {
    Injectable,
    Logger
}                                from '@nestjs/common';
import {JwtService}              from '@nestjs/jwt';
import {AuthDto}                 from './types/auth.dto';
import {RedisIntegrationService} from '../redis-integration/redis-integration.service';
import {RoleDto}                 from './types/role.dto';
import {mLog}                    from "utils-nestjs";
import {ConfigService}           from "@nestjs/config";
import {LokiLogger}              from "nestjs-loki-logger";

@Injectable()
export class VerifierService {
    private readonly logger = new LokiLogger(VerifierService.name)

    constructor(
        private readonly configService: ConfigService,
        private jwtService: JwtService,
        private readonly redis: RedisIntegrationService,
    ) {
    }

    async checkAuth(dto: AuthDto): Promise<boolean | null> {
        try {
            const payload        = (dto.request = await this.jwtService.verifyAsync(
                dto.cookie,
                {
                    secret: this.configService.get("SECRET_FOR_JWT"),
                },
            ));
            const user           = await this.redis.redisClient.keys(`*_${payload.username}_*`);
            const tokenFromRedis = await this.redis.redisClient.get(user[0]);
            if (tokenFromRedis === null) {
                this.logger.warn(mLog.log({
                    warn   : JSON.stringify({
                        userKeyInRedis: user
                    }),
                    handler: this.checkAuth.name,
                    message: "Warn while checking auth..."
                }) as string)
                return null;
            }
            this.logger.debug(mLog.log({
                info   : JSON.stringify({
                    userKeyInRedis: user,
                    tokenFromRedis: tokenFromRedis
                }),
                handler: this.checkAuth.name,
                message: "Auth got from redis..."
            }) as string)
            const tokenIsValid = tokenFromRedis === dto.cookie;
            if (!tokenIsValid) {
                this.logger.warn(mLog.log({
                    warn   : "Token is not valid",
                    handler: this.checkAuth.name,
                    message: "Warning while checking auth"
                }) as string)
                return null;
            }
            this.logger.log(mLog.log({
                info   : JSON.stringify({
                    userKeyInRedis: user,
                    tokenFromRedis: tokenFromRedis
                }),
                handler: this.checkAuth.name,
                message: `User ${payload.username} successfully checked`
            }) as string)
            return true;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.checkAuth.name,
                message: "Error while checking role"
            }) as string)
            return null;
        }
    }

    async checkRole(dto: RoleDto): Promise<boolean | null> {

        try {
            const payload = (dto.request = await this.jwtService.verifyAsync(
                dto.cookie,
                {
                    secret: this.configService.get("SECRET_FOR_JWT"),
                },
            ));
            const role    = payload.role === dto.roles;
            if (!role) {
                this.logger.warn(mLog.log({
                    warn   : "Unknown role",
                    handler: this.checkRole.name,
                    message: "Warning while checking role"
                }) as string)
                return null;
            }
            return true;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.checkRole.name,
                message: "Error while checking role"
            }) as string)
            return null;
        }
    }
}

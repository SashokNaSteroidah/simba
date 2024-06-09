import {
    Injectable,
    Logger
}                                from '@nestjs/common';
import {JwtService}              from '@nestjs/jwt';
import {AuthDto}                 from './types/auth.dto';
import {RedisIntegrationService} from '../redis-integration/redis-integration.service';
import {RoleDto}                 from './types/role.dto';
import {config}                  from "../../../../conf";
import {mLog}                    from "utils-nestjs";

@Injectable()
export class VerifierService {
    private readonly logger = new Logger(VerifierService.name)

    constructor(
        private jwtService: JwtService,
        private readonly redis: RedisIntegrationService,
    ) {
    }

    async checkAuth(dto: AuthDto): Promise<boolean | null> {
        try {
            const payload        = (dto.request = await this.jwtService.verifyAsync(
                dto.cookie,
                {
                    secret: config.GENERAL.secret_for_jwt,
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
                }))
                return null;
            }
            this.logger.debug(mLog.log({
                info   : JSON.stringify({
                    userKeyInRedis: user,
                    tokenFromRedis: tokenFromRedis
                }),
                handler: this.checkAuth.name,
                message: "Auth got from redis..."
            }))
            const tokenIsValid = tokenFromRedis === dto.cookie;
            if (!tokenIsValid) {
                this.logger.warn(mLog.log({
                    warn   : "Token is not valid",
                    handler: this.checkAuth.name,
                    message: "Warning while checking auth"
                }))
                return null;
            }
            this.logger.log(mLog.log({
                info   : JSON.stringify({
                    userKeyInRedis: user,
                    tokenFromRedis: tokenFromRedis
                }),
                handler: this.checkAuth.name,
                message: `User ${payload.username} successfully checked`
            }))
            return true;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.checkAuth.name,
                message: "Error while checking role"
            }))
            return null;
        }
    }

    async checkRole(dto: RoleDto): Promise<boolean | null> {

        try {
            const payload = (dto.request = await this.jwtService.verifyAsync(
                dto.cookie,
                {
                    secret: config.GENERAL.secret_for_jwt,
                },
            ));
            const role    = payload.role === dto.roles;
            if (!role) {
                this.logger.warn(mLog.log({
                    warn   : "Unknown role",
                    handler: this.checkRole.name,
                    message: "Warning while checking role"
                }))
                return null;
            }
            return true;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.checkRole.name,
                message: "Error while checking role"
            }))
            return null;
        }
    }
}

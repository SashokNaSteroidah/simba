import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './types/auth.dto';
import { RedisIntegrationService } from '../redis-integration/redis-integration.service';
import { RoleDto } from './types/role.dto';
import {config} from "../../../../conf";

@Injectable()
export class VerifierService {
  constructor(
    private jwtService: JwtService,
    private readonly redis: RedisIntegrationService,
  ) {}

  async checkAuth(dto: AuthDto): Promise<boolean | null> {
    try {
      const payload = (dto.request = await this.jwtService.verifyAsync(
        dto.cookie,
        {
          secret: config.GENERAL.secret_for_jwt,
        },
      ));
      const user = await this.redis.redisClient.keys(`*_${payload.username}_*`);
      const tokenFromRedis = await this.redis.redisClient.get(user[0]);
      if (tokenFromRedis === null) {
        return null;
      }
      const tokenIsValid = tokenFromRedis === dto.cookie;
      if (!tokenIsValid) {
        return null;
      }
      return true;
    } catch {
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
      const role = payload.role === dto.roles;
      if (!role) {
        return null;
      }
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

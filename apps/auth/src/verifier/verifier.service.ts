import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../main/src/libs/consts/jwtSecret.consts';
import { AuthDto } from './types/auth.dto';
import { RedisIntegrationService } from '../redis-integration/redis-integration.service';
import { RoleDto } from './types/role.dto';

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
          secret: jwtConstants.secret,
        },
      ));
      const user = await this.redis.keys(`*_${payload.username}_*`);
      const tokenFromRedis = await this.redis.get(user[0]);
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
      console.log(dto);
      const payload = (dto.request = await this.jwtService.verifyAsync(
        dto.cookie,
        {
          secret: jwtConstants.secret,
        },
      ));
      const role = payload.role === dto.roles;
      console.log(role);
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

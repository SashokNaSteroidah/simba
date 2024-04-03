import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern } from '@nestjs/microservices';
import { TokensType } from './types/tokens.type';
import { AuthAuthenticateUserDTO } from './types/authAuthenticateUser.dto';
import { LoginUserEventDto } from './types/events/loginUserEvent.dto';
import { AuthCreateUserDto } from './types/authCreateUser.dto';
import { RefreshTokenDto } from './types/refreshToken.dto';
import { RegResponceDto } from '../../main/src/auth/types/regResponce.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('login')
  async loginUser(dto: AuthAuthenticateUserDTO): Promise<LoginUserEventDto> {
    return await this.authService.loginUser(dto);
  }

  @EventPattern('registration')
  async regUser(dto: AuthCreateUserDto): Promise<RegResponceDto> {
    return await this.authService.regUser(dto);
  }

  @EventPattern('get_tokens')
  async getTokens(): Promise<TokensType[]> {
    return await this.authService.getTokens();
  }

  @EventPattern('refresh_token')
  async refreshToken(dto: RefreshTokenDto): Promise<string> {
    return await this.authService.refreshToken(dto);
  }
}

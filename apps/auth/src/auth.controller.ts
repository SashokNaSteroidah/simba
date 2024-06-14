import {
  Controller,
  Logger
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern } from '@nestjs/microservices';
import { TokensType } from './types/tokens.type';
import { AuthAuthenticateUserDTO } from './types/authAuthenticateUser.dto';
import { LoginUserEventDto } from './types/events/loginUserEvent.dto';
import { AuthCreateUserDto } from './types/authCreateUser.dto';
import { RefreshTokenDto } from './types/refreshToken.dto';
import { RegResponceDto } from '../../main/src/auth/types/regResponce.dto';
import {
  mLog
} from "utils-nestjs";

@Controller()
export class AuthController {

  private readonly logger = new Logger(AuthController.name)
  constructor(
      private readonly authService: AuthService
  ) {}

  @EventPattern('login')
  async loginUser(dto: AuthAuthenticateUserDTO): Promise<LoginUserEventDto> {
    this.logger.log(mLog.log({
      info   : JSON.stringify(dto),
      handler: this.loginUser.name,
      path   : "tcp//login",
      message: "Got logging request..."
    }))
    return await this.authService.loginUser(dto);
  }

  @EventPattern('registration')
  async regUser(dto: AuthCreateUserDto): Promise<RegResponceDto> {
    this.logger.log(mLog.log({
      info   : JSON.stringify(dto),
      handler: this.regUser.name,
      path   : "tcp//registration",
      message: "Got registration request..."
    }))
    return await this.authService.regUser(dto);
  }

  @EventPattern('get_tokens')
  async getTokens(): Promise<TokensType[]> {
    this.logger.log(mLog.log({
      handler: this.getTokens.name,
      path   : "tcp//get_tokens",
      message: "Got tokens list request..."
    }))
    return await this.authService.getTokens();
  }

  @EventPattern('refresh_token')
  async refreshToken(dto: RefreshTokenDto): Promise<string> {
    this.logger.log(mLog.log({
      info   : JSON.stringify(dto),
      handler: this.refreshToken.name,
      path   : "tcp//refresh_token",
      message: "Got refresh access token request..."
    }))
    return await this.authService.refreshToken(dto);
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuardDecor } from '../../decorators/roles.decorator';
import { DEFAULT_FORBIDDEN_ERROR } from '../../consts/errors.consts';
import { cookieParser } from '../../parser/cookieParser';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject('auth') private readonly authService: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get(RolesGuardDecor, context.getHandler());
      const req = context.switchToHttp().getRequest();
      const token = req.headers.cookie;
      const parsedCookie = cookieParser(token);
      if (!parsedCookie) {
        return false;
      }
      const sendData = {
        roles: roles,
        cookie: parsedCookie,
        request: request['user'],
      };
      const data: Observable<boolean | null> = this.authService.send(
        'check_role',
        sendData,
      );
      const parcedDataFromAuthService: boolean | null =
        await firstValueFrom(data);
      if (!parcedDataFromAuthService) {
        throw new Error();
      }
      return true;
    } catch {
      throw new HttpException(DEFAULT_FORBIDDEN_ERROR, HttpStatus.FORBIDDEN);
    }
  }
}

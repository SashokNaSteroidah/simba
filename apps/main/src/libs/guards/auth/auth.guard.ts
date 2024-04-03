import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DEFAULT_UNAUTHORIZED_ERROR } from '../../consts/errors.consts';
import { cookieParser } from '../../parser/cookieParser';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('auth') private communicationClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.cookie;
      const parsedCookie = cookieParser(token);
      if (!parsedCookie) {
        return false;
      }
      const sendBody = {
        cookie: parsedCookie,
        request: request['user'],
      };
      const data: Observable<boolean | null> = this.communicationClient.send(
        'check_auth',
        sendBody,
      );
      const parcedValueFromAuthService: boolean | null =
        await firstValueFrom(data);
      if (!parcedValueFromAuthService) {
        throw new Error();
      }
      return true;
    } catch (e) {
      throw new HttpException(
        DEFAULT_UNAUTHORIZED_ERROR,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

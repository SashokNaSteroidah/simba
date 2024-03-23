import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
}                        from '@nestjs/common';
import {JwtService}      from "@nestjs/jwt";
import {jwtConstants}    from "../constants/constants";
import {DatabaseService} from "../../database/database.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly databaseService: DatabaseService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token   = request.headers.cookie;
        const cookie = token.split('; ').find((item: string) => item.startsWith('Cookie='));
        const cookieValue = cookie.split('=')[1]
        if (!token) {
            return false
        }
        try {
            const data = await this.databaseService.tokens.findFirst({
                where: {
                    token: cookieValue
                }
            })
            if (!data) {
                return false
            }
            request['user'] = await this.jwtService.verifyAsync(
                cookieValue,
                {
                    secret: jwtConstants.secret
                }
            );
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}

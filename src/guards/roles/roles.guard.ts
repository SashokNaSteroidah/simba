import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable
}                        from "@nestjs/common";
import {jwtConstants}    from "../constants/constants";
import {JwtService}      from "@nestjs/jwt";
import {Reflector}       from "@nestjs/core";
import {RolesGuardDecor} from "../../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get(RolesGuardDecor, context.getHandler());
        const req   = context.switchToHttp().getRequest()
        const token = req.headers.cookie;
        const cookie = token.split('; ').find((item: string) => item.startsWith('Cookie='));
        const cookieValue = cookie.split('=')[1]
        try {
            const payload = req['user'] = await this.jwtService.verifyAsync(
                cookieValue,
                {
                    secret: jwtConstants.secret
                }
            );
            return payload.role === roles;
        } catch (e) {
            throw new HttpException("You don't have rights for this action", HttpStatus.FORBIDDEN);
        }
    }
}
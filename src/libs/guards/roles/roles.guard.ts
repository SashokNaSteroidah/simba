import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable
}                        from "@nestjs/common";
import {jwtConstants}    from "../../consts/jwtSecret.consts";
import {JwtService}      from "@nestjs/jwt";
import {Reflector}       from "@nestjs/core";
import {RolesGuardDecor} from "../../decorators/roles.decorator";
import {
    DEFAULT_FORBIDDEN_ERROR,
}                        from "../../consts/errors.consts";
import {cookieParser}    from "../../parser/cookieParser";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const roles       = this.reflector.get(RolesGuardDecor, context.getHandler());
            const req         = context.switchToHttp().getRequest()
            const token       = req.headers.cookie;
            const parsecCookie = cookieParser(token)
            const payload     = req['user'] = await this.jwtService.verifyAsync(
                parsecCookie,
                {
                    secret: jwtConstants.secret
                }
            );
            const role        = payload.role === roles
            if (role) {
                return true
            }
            throw new Error()
        } catch (e) {
            throw new HttpException(DEFAULT_FORBIDDEN_ERROR, HttpStatus.FORBIDDEN);
        }
    }
}
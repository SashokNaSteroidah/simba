import {
    CanActivate,
    ExecutionContext,
    Injectable
} from "@nestjs/common";
import {jwtConstants} from "../constants/constants";
import {JwtService} from "@nestjs/jwt";
import {Roles} from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req   = context.switchToHttp().getRequest()
        const token = req.headers.cookie;
        const payload = req['user'] = await this.jwtService.verifyAsync(
            token,
            {
                secret: jwtConstants.secret
            }
        );
        return payload.role === Roles.admin;
    }
}
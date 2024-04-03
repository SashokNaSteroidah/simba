import {
    Controller,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {VerifierService} from "./verifier.service";
import {
    EventPattern,
    MessagePattern
}                from "@nestjs/microservices";
import {AuthDto} from "./types/auth.dto";
import {RoleDto} from "./types/role.dto";


@Controller()
export class VerifierController {
    constructor(private readonly verifierService: VerifierService) {}


    @EventPattern("check_auth")
    async checkAuth(dto: AuthDto): Promise<boolean | null> {
        return this.verifierService.checkAuth(dto);
    }

    @EventPattern("check_role")
    async checkRole(dto: RoleDto): Promise<boolean | null> {
        return this.verifierService.checkRole(dto);
    }

}

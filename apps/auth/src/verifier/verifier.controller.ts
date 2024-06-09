import {
  Controller,
  Logger
} from '@nestjs/common';
import { VerifierService } from './verifier.service';
import { EventPattern } from '@nestjs/microservices';
import { AuthDto } from './types/auth.dto';
import { RoleDto } from './types/role.dto';
import {mLog} from "utils-nestjs";

@Controller()
export class VerifierController {
  private readonly logger = new Logger(VerifierController.name)
  constructor(private readonly verifierService: VerifierService) {}

  @EventPattern('check_auth')
  async checkAuth(dto: AuthDto): Promise<boolean | null> {
    this.logger.debug(mLog.log({
      info   : JSON.stringify(dto),
      handler: this.checkAuth.name,
      message: "Checking auth..."
    }))
    return this.verifierService.checkAuth(dto);
  }

  @EventPattern('check_role')
  async checkRole(dto: RoleDto): Promise<boolean | null> {
    this.logger.debug(mLog.log({
      info   : JSON.stringify(dto),
      handler: this.checkRole.name,
      message: "Checking role..."
    }))
    return this.verifierService.checkRole(dto);
  }
}

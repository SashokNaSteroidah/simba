import { IsEnum, IsString } from 'class-validator';
import { Roles } from '@prisma/client';

export class PatchUserDto {
  @IsString()
  @IsEnum(Roles)
  role: Roles;
}

export class PatchUserID {
  @IsString()
  id: string;
}

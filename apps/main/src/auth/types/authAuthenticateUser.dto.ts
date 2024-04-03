import { IsString } from 'class-validator';

export class AuthAuthenticateUserDTO {
  @IsString()
  name: string;
  @IsString()
  password: string;
}

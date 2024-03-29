import {
    IsEmail,
    IsString,
    Length,
} from "class-validator";

export class AuthCreateUserDto {
    @IsString()
    @Length(3, 20)
    name     : string;
    @IsString()
    password : string;
    @IsEmail()
    email    : string;
}
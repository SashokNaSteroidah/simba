import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe
}                          from '@nestjs/common';
import {AuthService}       from "./auth.service";
import {AuthCreateUserDto}       from "./types/authCreateUser.dto";
import {AuthAuthenticateUserDTO} from "./types/authAuthenticateUser.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
@UsePipes(new ValidationPipe())
    @Post("login")
    async loginUser(@Body() dto: AuthAuthenticateUserDTO): Promise<unknown> {
        return await this.authService.loginUser(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post("registration")
    registerUser(@Body() dto: AuthCreateUserDto): Promise<string> {
        return this.authService.registerUser(dto);
    }
}

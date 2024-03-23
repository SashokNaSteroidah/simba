import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
}                                from '@nestjs/common';
import {DatabaseService}         from "../database/database.service";
import {AuthCreateUserDto}       from "./types/authCreateUser.dto";
import * as bcrypt               from 'bcrypt';
import {
    Prisma,
    Roles
}                                from "@prisma/client";
import {AuthAuthenticateUserDTO} from "./types/authAuthenticateUser.dto";
import {JwtService}              from "@nestjs/jwt";
import {
    Response,
}                                from "express";

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) {
    }

    async loginUser(dto: AuthAuthenticateUserDTO, response: Response): Promise<string> {
        try {
            const user = await this.databaseService.users.findFirst({where: {name: dto.name}})
            const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.password.trim())
            if (!isPasswordValid) {
                throw new UnauthorizedException();
            }
            const payload = {
                id      : user.id,
                username: user.name,
                role    : user.role
            };
            const token   = await this.jwtService.signAsync(payload)
            await this.databaseService.tokens.create({
                data: {
                    token: token
                }
            })
            response.cookie("Cookie", token)
            return "OK"
        } catch (e) {
            if (e.status === 401) {
                throw new HttpException("This users doesn't exist", HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Unexpected user scenario", HttpStatus.BAD_REQUEST);
        }
    }

    async registerUser(dto: AuthCreateUserDto): Promise<string> {
        try {
            const saltOrRounds = 10;
            const hash         = await bcrypt.hash(dto.password, saltOrRounds);

            await this.databaseService.users.create({
                data: {
                    id      : crypto.randomUUID(),
                    name    : dto.name,
                    password: hash,
                    role    : Roles.user,
                    email   : dto.email
                }
            })
            return "OK"
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                    throw new HttpException('There is a unique constraint violation, a new user cannot be created with this email or name', HttpStatus.BAD_REQUEST);
                }
            }
            throw e
        }
    }
}

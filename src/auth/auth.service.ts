import {
    HttpException,
    HttpStatus,
    Injectable
}                                from '@nestjs/common';
import {DatabaseService}         from "../database/database.service";
import {AuthCreateUserDto}       from "./types/authCreateUser.dto";
import * as bcrypt               from 'bcrypt';
import {
    Prisma,
    Roles
}                                from "@prisma/client";
import {AuthAuthenticateUserDTO} from "./types/authAuthenticateUser.dto";

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService) {
    }

    async loginUser(dto: AuthAuthenticateUserDTO): Promise<unknown> {
        try {
            const {password} = await this.databaseService.users.findFirst({where: {name: dto.name}})
            return await bcrypt.compare(dto.password, password.trim())
        } catch (e) {
            console.error(e.message, e.code)
            throw new HttpException("This users does not exists", HttpStatus.BAD_REQUEST);
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
                    throw new HttpException('There is a unique constraint violation, a new user cannot be created with this email', HttpStatus.BAD_REQUEST);
                }
            }
            throw e
        }
    }
}

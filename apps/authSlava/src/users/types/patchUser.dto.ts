import {IsString} from "class-validator";
import {Roles}    from "@prisma/client";

export class PatchUserDto {
    @IsString()
    role: Roles;
}

export class PatchUserID {
    @IsString()
    id: string
}
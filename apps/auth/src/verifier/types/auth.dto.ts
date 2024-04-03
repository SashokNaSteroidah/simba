import {IsString} from "class-validator";

export interface AuthDto {
    cookie: string;
    request: any
}
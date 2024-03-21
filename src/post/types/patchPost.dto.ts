import {IsString} from "class-validator";

export class PatchPostDto {
    @IsString()
    title  : string;
    @IsString()
    content: string;
}

export class PatchPostID {
    @IsString()
    id     : string
}
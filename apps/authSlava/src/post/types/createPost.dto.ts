import {
    IsString,
    Length,
} from "class-validator";

export class CreatePostDto {
    @IsString()
    @Length(10, 100)
    title     : string
    @IsString()
    @Length(20, 1000)
    content   : string
}
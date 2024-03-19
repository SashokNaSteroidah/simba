import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
}                      from '@nestjs/common';
import {PostService}   from "./post.service";
import {CreatePostDto} from "./types/createPost.dto";
import {GetPostDto} from "./types/getPost.dto";
import {AuthGuard}  from "../guards/auth/auth.guard";
import {
    RolesGuardDecor
}                   from "../decorators/roles.decorator";
import {Roles}         from "@prisma/client";
import {RolesGuard}    from "../guards/roles/roles.guard";

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Post()
    async CreatePost(@Body() dto: CreatePostDto): Promise<string> {
        return await this.postService.CreatePost(dto)
    }

    @Get()
    async getPosts(): Promise<GetPostDto[]> {
        return await this.postService.getPosts()
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
}                      from '@nestjs/common';
import {PostService}   from "./post.service";
import {CreatePostDto} from "./types/createPost.dto";
import {AuthGuard}     from "../guards/auth/auth.guard";
import {
    RolesGuardDecor
}                      from "../decorators/roles.decorator";
import {
    posts,
    Roles
}                      from "@prisma/client";
import {RolesGuard}    from "../guards/roles/roles.guard";
import {DeletePostDto} from "./types/deletePost.dto";
import {
    PatchPostDto,
    PatchPostID
}                     from "./types/patchPost.dto";

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
    async getPosts(): Promise<posts[]> {
        return await this.postService.getPosts()
    }

    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Patch(":id")
    async UpdatePost(@Body() dto: PatchPostDto, @Param() params: PatchPostID): Promise<string> {
        return await this.postService.PatchPost(dto, params)
    }


    @RolesGuardDecor(Roles.admin)
    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Delete(":id")
    async DeletePost(@Param() params: DeletePostDto): Promise<string> {
        return await this.postService.DeletePost(params)
    }

}

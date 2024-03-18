import {
    Body,
    Controller,
    Get,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostDto} from "./types/createPost.dto";
import {GetPostDto} from "./types/getPost.dto";

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {
    }

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

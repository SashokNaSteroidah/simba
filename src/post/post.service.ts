import {
    HttpException,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import {DatabaseService} from "../database/database.service";
import {CreatePostDto} from "./types/createPost.dto";
import {GetPostDto} from "./types/getPost.dto";
import {contains} from "class-validator";

@Injectable()
export class PostService {
    constructor(private readonly databaseService: DatabaseService) {
    }

    async CreatePost(dto: CreatePostDto): Promise<string> {
        try {
            await this.databaseService.posts.create({
                data: {
                    title: dto.title,
                    content: dto.content,
                }
            })
            return "OK"
        } catch (e) {
            throw new HttpException("Can't create post", HttpStatus.BAD_REQUEST);
        }
    }

    async getPosts(): Promise<GetPostDto[]> {
        try {
            return await this.databaseService.posts.findMany()
        } catch (e) {
            throw new HttpException("Unexpected user scenario", HttpStatus.BAD_REQUEST);
        }
    }
}

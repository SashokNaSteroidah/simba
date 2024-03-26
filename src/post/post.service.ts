import {
    HttpException,
    HttpStatus,
    Injectable
}                        from '@nestjs/common';
import {DatabaseService} from "../database/database.service";
import {CreatePostDto}   from "./types/createPost.dto";
import {DeletePostDto}   from "./types/deletePost.dto";
import {
    PatchPostDto,
    PatchPostID
}                        from "./types/patchPost.dto";
import {posts} from "@prisma/client";
import {
    DEFAULT_SERVER_ERROR
}              from "../libs/consts/errors.consts";

@Injectable()
export class PostService {
    constructor(private readonly databaseService: DatabaseService) {
    }

    async CreatePost(dto: CreatePostDto): Promise<string> {
        try {
            await this.databaseService.posts.create({
                data: {
                    title  : dto.title,
                    content: dto.content,
                }
            })
            return "OK"
        } catch (e) {
            throw new HttpException("Can't create post", HttpStatus.BAD_REQUEST);
        }
    }

    async PatchPost(dto: PatchPostDto, params: PatchPostID): Promise<string> {
        if (!params && !params.id) {
            throw new HttpException("Invalid params", HttpStatus.BAD_REQUEST)
        }
        try {
            await this.databaseService.posts.update({
                where: {
                    id: +params.id,
                },
                data : {
                    title    : dto.title,
                    content  : dto.content,
                    updatedAt: new Date(),
                }
            })
            return "OK"
        } catch (e) {
            throw new HttpException("Can't update post", HttpStatus.BAD_REQUEST);
        }
    }

    async DeletePost(params: DeletePostDto): Promise<string> {
        if (!params && !params.id) {
            throw new HttpException("Invalid params", HttpStatus.BAD_REQUEST)
        }
        try {
            await this.databaseService.posts.delete({
                where: {
                    id: +params.id
                }
            })
            return "OK"
        } catch (e) {
            // console.log(e)
            throw new HttpException("Can't delete post", HttpStatus.BAD_REQUEST);
        }
    }

    async getPosts(): Promise<posts[]> {
        try {
            return await this.databaseService.posts.findMany()
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }
}

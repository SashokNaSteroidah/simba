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
}                             from "../libs/consts/errors.consts";
import {DefaultOkResponseDto} from "../libs/response/defaultOkResponse.dto";
import {DefaultOkResponse}    from "../libs/response/defaultOkResponse.interfaces";

@Injectable()
export class PostService {
    constructor(private readonly databaseService: DatabaseService) {
    }

    async CreatePost(dto: CreatePostDto): Promise<DefaultOkResponse> {
        try {
            await this.databaseService.posts.create({
                data: {
                    title  : dto.title,
                    content: dto.content,
                }
            })
            return DefaultOkResponseDto
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async PatchPost(dto: PatchPostDto, params: PatchPostID): Promise<DefaultOkResponse> {
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
            return DefaultOkResponseDto
        } catch (e) {
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async DeletePost(params: DeletePostDto): Promise<DefaultOkResponse> {
        if (!params && !params.id) {
            throw new HttpException("Invalid params", HttpStatus.BAD_REQUEST)
        }
        try {
            await this.databaseService.posts.delete({
                where: {
                    id: +params.id
                }
            })
            return DefaultOkResponseDto
        } catch (e) {
            // console.log(e)
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
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

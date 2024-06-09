import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger
}                             from '@nestjs/common';
import {DatabaseService}      from '../database/database.service';
import {CreatePostDto}        from './types/createPost.dto';
import {DeletePostDto}        from './types/deletePost.dto';
import {
    PatchPostDto,
    PatchPostID
}                             from './types/patchPost.dto';
import {posts}                from '@prisma/client';
import {DEFAULT_SERVER_ERROR} from '../libs/consts/errors.consts';
import {DefaultOkResponseDto} from '../libs/response/defaultOkResponse.dto';
import {DefaultOkResponse}    from '../libs/response/defaultOkResponse.interfaces';
import {
    httpMethods,
    mLog,
}                             from 'utils-nestjs';

@Injectable()
export class PostService {

    private readonly logger = new Logger(PostService.name)

    constructor(
        private readonly databaseService: DatabaseService
    ) {
    }

    async CreatePost(dto: CreatePostDto): Promise<DefaultOkResponse> {
        try {
            await this.databaseService.posts.create({
                data: {
                    title  : dto.title,
                    content: dto.content,
                },
            });
            this.logger.debug(mLog.log({
                method : httpMethods.POST,
                handler: this.CreatePost.name,
                path   : "/api/post",
                message: "Post created in DB"
            }))
            return DefaultOkResponseDto;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.POST,
                handler: this.CreatePost.name,
                path   : "/api/post",
                message: "Error while creating post"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async PatchPost(
        dto: PatchPostDto,
        params: PatchPostID,
    ): Promise<DefaultOkResponse> {
        if (!params && !params.id) {
            this.logger.warn(mLog.log({
                warn   : "Invalid params",
                method : httpMethods.PATCH,
                handler: this.PatchPost.name,
                path   : "/api/post",
                message: "Invalid params while patching post"
            }))
            throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
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
                },
            });
            this.logger.debug(mLog.log({
                method : httpMethods.PATCH,
                handler: this.PatchPost.name,
                path   : "/api/post",
                message: "Post successfully updated in DB"
            }))
            return DefaultOkResponseDto;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.PATCH,
                handler: this.PatchPost.name,
                path   : "/api/post",
                message: "Error while updating post"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async DeletePost(params: DeletePostDto): Promise<DefaultOkResponse> {
        if (!params && !params.id) {
            this.logger.warn(mLog.log({
                warn   : "Invalid params",
                method : httpMethods.DELETE,
                handler: this.DeletePost.name,
                path   : "/api/post",
                message: "Invalid params while deleting post"
            }))
            throw new HttpException('Invalid params', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.databaseService.posts.delete({
                where: {
                    id: +params.id,
                },
            });
            this.logger.debug(mLog.log({
                method : httpMethods.DELETE,
                handler: this.DeletePost.name,
                path   : "/api/post",
                message: "Post successfully deleted from DB"
            }))
            return DefaultOkResponseDto;
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                method : httpMethods.DELETE,
                handler: this.DeletePost.name,
                path   : "/api/post",
                message: "Error while deleting post"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }

    async getPosts(): Promise<posts[]> {
        try {
            const data = await this.databaseService.posts.findMany();
            this.logger.debug(mLog.log({
                method : httpMethods.GET,
                handler: this.getPosts.name,
                path   : "/api/post",
                message: "Posts successfully get from DB"
            }))
            return data
        } catch (e) {
            this.logger.error(mLog.log({
                error  : JSON.stringify(e),
                handler: this.getPosts.name,
                path   : "/api/post",
                method : httpMethods.GET,
                message: "Error while fetch posts"
            }))
            throw new HttpException(DEFAULT_SERVER_ERROR, HttpStatus.BAD_GATEWAY);
        }
    }
}

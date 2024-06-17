import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import * as process from "process";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly httpService: HttpService) {}
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() === 'http') {
            return this.logHttpCall(context, next);
        }
    }

    private async pushToGrafana(body: string) {
        const logs = {
            streams: [
                {
                    stream: {
                        env: process.env.NODE_ENV,
                    },
                    values: [[(Date.now() * 1e6).toString(), body]],
                },
            ],
        };
        try {
            await firstValueFrom(
                this.httpService
                    .post(process.env.GRAFANA_URL, logs, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .pipe(
                        catchError((error: AxiosError) => {
                            this.logger.error(error.response.data);
                            throw error;
                        }),
                    ),
            );
        } catch (error) {
            this.logger.error(error.toString());
        }
    }

    private logHttpCall(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const userAgent = request.get('user-agent') || '';
        const { ip, method, path: url } = request;
        const correlationKey = crypto.randomUUID();
        const userId = request.user?.userId;

        this.logger.log(
            `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip}: ${
                context.getClass().name
            } ${context.getHandler().name}`,
        );

        const now = Date.now();
        return next.handle().pipe(
            tap(async () => {
                const response = context.switchToHttp().getResponse();

                const { statusCode } = response;
                const contentLength = response.get('content-length');
                const logData = `[${correlationKey}] ${method} ${url} ${statusCode} ${contentLength}: ${
                    Date.now() - now
                }ms`;
                this.logger.log(logData);
                await this.pushToGrafana(logData);
            }),
        );
    }
}
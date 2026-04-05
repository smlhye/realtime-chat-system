import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { BaseExceptionPayload } from '../errors/base.exception';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { ErrorCode } from '../constants/error-codes';

export interface ResponseFormat<T> {
    statusCode: HttpStatus,
    success: boolean;
    error: {
        code: ErrorCode | null,
        message: string | string [],
    } | null;
    data: T | null;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ResponseFormat<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const defaultStatus = response?.statusCode ?? HttpStatus.OK;

        return next.handle().pipe(
            map((res) => ({
                statusCode: defaultStatus,
                success: true,
                error: null,
                data: res ?? null,
            })),
        );
    }
}
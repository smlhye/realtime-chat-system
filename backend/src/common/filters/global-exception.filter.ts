import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "../constants/error-codes";
import { BaseException } from "../errors/base.exception";
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        let status: HttpStatus;
        let code: ErrorCode;
        let message: string | string[];
        let data: unknown = null;
        let success: boolean = false;

        if (exception instanceof BaseException) {
            status = exception.getStatus();
            code = exception.code;
            message = this.getMessageFromResponse(exception.getResponse()) ?? exception.message;
            data = exception.data;
            success = exception.success;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const excResponse = exception.getResponse();
            if (typeof excResponse === 'string') {
                message = excResponse;
                code = ErrorCode.INTERNAL_ERROR;
            } else if (typeof excResponse === 'object' && excResponse !== null) {
                const respObj = excResponse as Record<string, any>;
                message = respObj.message ?? 'Bad Request';
                code = respObj.code ?? ErrorCode.INTERNAL_ERROR;
                data = respObj.data ?? null;
                success = respObj.success ?? false;
            } else {
                message = 'Bad Request';
                code = ErrorCode.INTERNAL_ERROR;
            }
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            code = ErrorCode.INTERNAL_ERROR;
            message = 'Internal server error';
            data = null;
            success = false;
        }

        res.status(status).json({
            statusCode: status,
            success,
            error: { code, message },
            data,
        });
    }

    private getMessageFromResponse(response: unknown): string | string[] | undefined {
        if (typeof response === 'object' && response !== null && 'message' in response) {
            return (response as { message: string | string[] }).message;
        }
        return undefined;
    }
}
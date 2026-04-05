import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode, ErrorCodeConfig } from "../constants/error-codes";

export interface BaseExceptionPayload {
    code: ErrorCode;
    message: string | string[],
    status?: HttpStatus,
    data?: unknown,
    success?: boolean,
}

export class BaseException extends HttpException {
    public readonly code: ErrorCode;
    public readonly data: unknown;
    public readonly success: boolean;

    constructor(payload: BaseExceptionPayload) {
        const success = payload.success ?? false;
        super(
            {
                code: payload.code,
                message: payload.message,
                success,
            },
            payload.status ?? ErrorCodeConfig[payload.code].status
        );

        this.code = payload.code;
        this.data = payload.data ?? null;
        this.success = success;
    }
}
import { HttpStatus } from "@nestjs/common";

export enum ErrorCode {
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    VALIDATION_FAILED = 'VALIDATION_FAILED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    MESSAGE_SEND_FAIL = 'MESSAGE_SEND_FAIL',
    AUTH_FAILED = 'AUTH_FAILED',
    ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
}

export const ErrorCodeConfig: Record<ErrorCode, { status: HttpStatus }> = {
    [ErrorCode.INTERNAL_ERROR]: { status: HttpStatus.INTERNAL_SERVER_ERROR },
    [ErrorCode.VALIDATION_FAILED]: { status: HttpStatus.BAD_REQUEST },
    [ErrorCode.USER_NOT_FOUND]: { status: HttpStatus.NOT_FOUND },
    [ErrorCode.MESSAGE_SEND_FAIL]: { status: HttpStatus.BAD_REQUEST },
    [ErrorCode.AUTH_FAILED]: { status: HttpStatus.UNAUTHORIZED },
    [ErrorCode.ROOM_NOT_FOUND]: { status: HttpStatus.NOT_FOUND },
};
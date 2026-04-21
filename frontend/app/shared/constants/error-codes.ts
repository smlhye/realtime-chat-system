export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

export enum ErrorCode {
    // Common
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

    INTERNAL_ERROR = 'INTERNAL_ERROR',
    BAD_GATEWAY = 'BAD_GATEWAY',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',


    VALIDATION_FAILED = 'VALIDATION_FAILED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    MESSAGE_SEND_FAIL = 'MESSAGE_SEND_FAIL',
    AUTH_FAILED = 'AUTH_FAILED',
    ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
}

export const ErrorCodeConfig: Record<ErrorCode, { status: HttpStatus }> = {
    [ErrorCode.UNAUTHORIZED]: { status: HttpStatus.UNAUTHORIZED },
    [ErrorCode.FORBIDDEN]: { status: HttpStatus.FORBIDDEN },
    [ErrorCode.NOT_FOUND]: { status: HttpStatus.NOT_FOUND },
    [ErrorCode.CONFLICT]: { status: HttpStatus.CONFLICT },
    [ErrorCode.TOO_MANY_REQUESTS]: { status: HttpStatus.TOO_MANY_REQUESTS },

    [ErrorCode.INTERNAL_ERROR]: { status: HttpStatus.INTERNAL_SERVER_ERROR },
    [ErrorCode.BAD_GATEWAY]: { status: HttpStatus.BAD_GATEWAY },
    [ErrorCode.SERVICE_UNAVAILABLE]: { status: HttpStatus.SERVICE_UNAVAILABLE },
    [ErrorCode.GATEWAY_TIMEOUT]: { status: HttpStatus.GATEWAY_TIMEOUT },

    [ErrorCode.VALIDATION_FAILED]: { status: HttpStatus.BAD_REQUEST },
    [ErrorCode.USER_NOT_FOUND]: { status: HttpStatus.NOT_FOUND },
    [ErrorCode.MESSAGE_SEND_FAIL]: { status: HttpStatus.BAD_REQUEST },
    [ErrorCode.AUTH_FAILED]: { status: HttpStatus.UNAUTHORIZED },
    [ErrorCode.ROOM_NOT_FOUND]: { status: HttpStatus.NOT_FOUND },
    [ErrorCode.EMAIL_ALREADY_EXISTS]: { status: HttpStatus.CONFLICT },
    [ErrorCode.USERNAME_ALREADY_EXISTS]: { status: HttpStatus.CONFLICT },
};
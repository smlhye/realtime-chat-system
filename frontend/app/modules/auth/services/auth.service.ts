import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { SignInRequest, SignUpRequest } from "@/app/schemas/generated/type";
import { schemas } from "@/app/schemas/generated/client";
import http from "@/app/services/http";
import { ErrorCode } from "@/app/shared/constants/error-codes";

export const authService = {
    signInApi: async (data: SignInRequest) => {
        try {
            const res = await http.post("auth/sign-in", data);
            return parseApiResponse(createApiResponseSchema(schemas.SignInResponse), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.AUTH_FAILED) {
                    throw new Error('Tài khoản hoặc mật khẩu sai')
                }
                if (data.error?.code === ErrorCode.USER_NOT_FOUND) {
                    throw new Error('Tài khoản hoặc mật khẩu sai')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    signUpApi: async (data: SignUpRequest) => {
        try {
            const res = await http.post("auth/sign-up", data);
            return parseApiResponse(createApiResponseSchema(schemas.SignUpResponse), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.USERNAME_ALREADY_EXISTS) {
                    throw new Error('Tên tài khoản đã được sử dụng')
                }
                if (data.error?.code === ErrorCode.EMAIL_ALREADY_EXISTS) {
                    throw new Error('Email đã được sử dụng')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    logoutApi: async () => {
        try {
            const res = await http.post("auth/sign-out");
            return res.data.data;
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.AUTH_FAILED) {
                    throw new Error('Đăng xuất không thành công')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },
}
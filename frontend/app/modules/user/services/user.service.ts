import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { schemas } from "@/app/schemas/generated/client";
import http from "@/app/services/http"
import { ErrorCode } from "@/app/shared/constants/error-codes";

export const userService = {
    fetchMe: async () => {
        try {
            const res = await http.get('users/me');
            return parseApiResponse(createApiResponseSchema(schemas.UserResponse), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.USER_NOT_FOUND) {
                    throw new Error('Người dùng không tồn tại')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    }
}
import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import http from "@/app/services/http";
import { ChatsResponseSchema } from "../schemas/chats-response.schema";
import { ErrorCode } from "@/app/shared/constants/error-codes";
import { MessagesResponse } from "../schemas/messages-response.schema";

export const chatService = {
    getChatsOfUser: async ({ name, take, cursor }: { name?: string, take?: number, cursor?: string }) => {
        try {
            const res = await http.get("chats", {
                params: {
                    ...(name && { name }),
                    ...(take && { take }),
                    ...(cursor && { cursor }),
                }
            });
            return parseApiResponse(createApiResponseSchema(MessagesResponse), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                switch (data.error?.code) {
                    case ErrorCode.UNAUTHORIZED:
                        throw new Error('Vui lòng đăng nhập');
                    case ErrorCode.USER_NOT_FOUND:
                        throw new Error('Không tìm thấy người dùng này');
                    default:
                        throw new Error("Không thể kết nối server");
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    getMessagesOfChat: async ({ chatId, take, cursor, after, messageId }
        : { chatId: string, take?: number, cursor?: string, after?: string, messageId?: string }) => {
        try {
            const res = await http.get(`chats/${chatId}/messages`, {
                params: {
                    ...(take && { take }),
                    ...(after && { after }),
                    ...(cursor && { cursor }),
                    ...(messageId && { messageId }),
                }
            });
            return parseApiResponse(createApiResponseSchema(MessagesResponse), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                switch (data.error?.code) {
                    case ErrorCode.UNAUTHORIZED:
                        throw new Error('Vui lòng đăng nhập');
                    case ErrorCode.USER_NOT_FOUND:
                        throw new Error('Không tìm thấy người dùng này')
                    case ErrorCode.FORBIDDEN:
                        throw new Error('Bạn không thể truy cập trò chuyện này');
                    default:
                        throw new Error("Không thể kết nối server");
                }
            }
            throw new Error("Không thể kết nối server");
        }
    }
}
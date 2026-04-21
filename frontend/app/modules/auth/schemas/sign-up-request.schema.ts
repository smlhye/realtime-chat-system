import { z } from "zod";

export const SignUpRequest = z
    .object({
        username: z
            .string()
            .min(6, { message: "Tên tài khoản phải có ít nhất 6 ký tự" })
            .refine((val) => !/\s/.test(val), {
                message: "Tên tài khoản không được chứa khoảng trắng",
            }),

        email: z
            .email({ message: "Email không hợp lệ" }),

        password: z
            .string()
            .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
            .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/, {
                message: "Phải có chữ hoa và ký tự đặc biệt",
            }),

        fullName: z
            .string()
            .min(2, { message: "Họ tên phải có ít nhất 2 ký tự" })
            .refine((val) => val.trim().length > 0, {
                message: "Không được chỉ nhập khoảng trắng",
            })
            .refine((val) => !/\d/.test(val), {
                message: "Họ tên không được chứa số",
            })
            .transform((val) =>
                val
                    .trim()
                    .toLowerCase()
                    .split(/\s+/)
                    .map(
                        (word) =>
                            word.charAt(0).toLocaleUpperCase("vi-VN") +
                            word.slice(1)
                    )
                    .join(" ")
            ),

        confirmPassword: z.string({
            message: "Vui lòng xác nhận mật khẩu",
        })
            .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    })
    .passthrough();

export type SignUpRequestType = z.infer<typeof SignUpRequest>;
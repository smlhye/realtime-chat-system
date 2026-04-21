"use client";

import { useAuthService } from "../../hooks/useAuthService";
import { useSignUp } from "../../hooks/useSignUp";
import { Button, Input, Card } from "@/app/shared/components/ui";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
    const { form, onSubmit, loading } = useSignUp();

    const {
        showPassword, setShowPassword,
        showConfirmPassword, setShowConfirmPassword
    } = useAuthService();

    const { register, formState: { errors } } = form;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 min-w-[500px]">
            <div className="w-full max-w-md animate-in">

                <Card className="space-y-6 p-6">

                    <h2 className="text-2xl font-semibold text-center">
                        Tạo tài khoản
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-4">

                        <div className="space-y-1">
                            <label className="text-sm text-[color:var(--muted-foreground)]">
                                Họ và tên
                            </label>

                            <Input
                                type="text"
                                placeholder="Họ và tên"
                                {...register("fullName")}
                            />

                            {errors.fullName && (
                                <p className="text-xs text-[color:var(--destructive)]">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-[color:var(--muted-foreground)]">
                                Email
                            </label>

                            <Input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                            />

                            {errors.email && (
                                <p className="text-xs text-[color:var(--destructive)]">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-[color:var(--muted-foreground)]">
                                Tên tài khoản
                            </label>

                            <Input
                                type="text"
                                placeholder="Tên tài khoản"
                                {...register("username")}
                            />

                            {errors.username && (
                                <p className="text-xs text-[color:var(--destructive)]">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-[color:var(--muted-foreground)]">
                                Mật khẩu
                            </label>

                            <div className="relative">
                                <Input
                                    placeholder={showPassword ? "Mật khẩu của bạn" : "••••••••"}
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-xs text-[color:var(--destructive)]">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-[color:var(--muted-foreground)]">
                                Xác nhận mật khẩu
                            </label>

                            <div className="relative">
                                <Input
                                    placeholder={showConfirmPassword ? "Xác nhận mật khẩu" : "••••••••"}
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                                >
                                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <p className="text-xs text-[color:var(--destructive)]">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                        >
                            Đăng ký
                        </Button>
                    </form>

                    <div className="text-xs text-[color:var(--muted-foreground)] text-center">
                        Bạn đã có tài khoản?{" "}
                        <Link href="/sign-in" className="underline hover:text-[color:var(--foreground)]">
                            Đăng nhập ngay
                        </Link>
                    </div>

                </Card>

            </div>
        </div>
    );
}
"use client";

import { Button, Input, Card } from "@/app/shared/components/ui";
import { useAuthService } from "../../hooks/useAuthService";
import { useSignIn } from "../../hooks/useSignIn";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
    const { form, onSubmit, loading } = useSignIn();
    const { showPassword, setShowPassword } = useAuthService();
    const { register, formState: { errors } } = form;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 min-w-[500px]">
            <div className="w-full max-w-md animate-in">

                <Card className="space-y-6 p-6">
                    <h2 className="text-2xl font-semibold text-center">
                        Đăng nhập
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-4">

                        <div className="space-y-1">
                            <label className="text-sm text-[color:var(--muted-foreground)]">
                                Tài khoản
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-xs text-[color:var(--destructive)]">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    <div className="flex justify-between text-xs text-[color:var(--muted-foreground)]">
                        <span>
                            Chưa có tài khoản?{" "}
                            <Link href="/sign-up" className="underline hover:text-[color:var(--foreground)]">
                                Đăng ký
                            </Link>
                        </span>

                        <Link
                            href="/forgot-password"
                            className="underline hover:text-[color:var(--foreground)]"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                </Card>

            </div>
        </div>
    );
}
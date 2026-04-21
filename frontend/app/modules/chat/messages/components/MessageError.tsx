'use client';

import { AlertTriangle } from "lucide-react";

export function MessageError({ error }: { error: unknown }) {
    return (
        <div className="h-full flex items-center justify-center bg-[color:var(--background)]">
            <div className="text-center max-w-md animate-in">

                <div className="mx-auto w-14 h-14 rounded-xl flex items-center bg-[color:var(--card)] justify-center shadow-soft mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>

                <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
                    Không thể tải tin nhắn
                </h2>

                <p className="mt-2 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                    {error instanceof Error
                        ? error.message
                        : "Đã xảy ra lỗi không xác định khi tải dữ liệu."}
                </p>
            </div>
        </div>
    );
}
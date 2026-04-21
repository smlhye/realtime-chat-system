'use client'

import { MessageCircle } from "lucide-react"

export default function NoChatSelected() {
    return (
        <div className="h-full flex items-center justify-center bg-[color:var(--background)]">
            <div className="text-center max-w-md animate-in">

                {/* Icon */}
                <div className="mx-auto w-14 h-14 rounded-xl flex items-center bg-[color:var(--card)] justify-center shadow-soft mb-4">
                    <MessageCircle className="w-6 h-6 text-[color:var(--primary)]" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
                    Chưa có cuộc trò chuyện nào được chọn
                </h2>

                {/* Subtitle */}
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                    Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.
                </p>

                {/* Decorative gradient glow */}
                <div className="mt-8 relative">
                    <div className="absolute inset-0 blur-3xl opacity-40 bg-[radial-gradient(circle_at_top,var(--primary),transparent_70%)]" />
                    <div className="relative h-10 w-40 mx-auto rounded-full glass" />
                </div>
            </div>
        </div>
    )
}
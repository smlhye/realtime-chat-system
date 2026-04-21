"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/cn";

type Props = {
    title?: string;
};

export function ChatMobileHeader({ title = "Chat" }: Props) {
    const router = useRouter();

    return (
        <div
            className={cn(
                "flex md:hidden items-center gap-3",
                "h-12 px-3",
                "border-b border-[color:var(--border)]",
                "bg-[color:var(--card)]",
                "sticky top-0 z-50",
            )}
        >
            <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-muted transition"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="font-medium text-sm truncate">
                {title}
            </div>
        </div>
    );
}
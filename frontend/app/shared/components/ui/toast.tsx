"use client";

import { useEffect } from "react";
import { cn } from "@/app/lib/cn";

export function Toast({
    message,
    onClose,
}: {
    message: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-50",
                "px-4 py-3 rounded-xl border",
                "bg-[color:var(--card)]/90 backdrop-blur-xl",
                "shadow-elevated animate-in"
            )}
        >
            {message}
        </div>
    );
}
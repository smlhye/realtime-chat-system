"use client";

import { cn } from "@/app/lib/cn";

export function Modal({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={cn(
                    "w-full max-w-md rounded-xl p-5",
                    "bg-[rgb(var(--card)/0.8)] backdrop-blur-xl",
                    "shadow-2xl animate-[scaleIn_.2s_ease]"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
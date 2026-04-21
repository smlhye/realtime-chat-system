"use client";

import { cn } from "@/app/lib/cn";
import { Button } from "./button";

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    confirmMessage,
    description,
    className,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmMessage?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    className?: string;
}) {
    if (!open) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center",
                "bg-black/40 backdrop-blur-sm",
                "animate-[fade-in_0.15s_ease]"
            )}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "w-[420px] rounded-2xl border",
                    "bg-[color:var(--card)] backdrop-blur-xl",
                    "shadow-elevated",
                    "p-6 space-y-4",
                    "animate-[slide-up_0.2s_ease]",
                    className
                )}
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[color:var(--destructive)]/10 text-[color:var(--destructive)]">
                        !
                    </div>

                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-[color:var(--foreground)]">
                            {confirmMessage}
                        </h3>

                        {description && (
                            <p className="mt-1 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="h-px bg-[color:var(--border)]" />

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="interactive"
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onConfirm}
                        className="interactive"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
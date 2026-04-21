"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/cn";

type Variant = "default" | "danger";

type DropdownItem = {
    label?: string;
    onClick?: () => void;
    variant?: Variant;
    icon?: React.ElementType;
    divider?: boolean;
};

interface DropdownProps {
    trigger: React.ReactNode;
    className?: string;
    onTrigger?: (value: boolean) => void;
    items: DropdownItem[];
}

export function Dropdown({
    trigger,
    items,
    className,
    onTrigger,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                onTrigger?.(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onTrigger]);

    return (
        <div ref={ref} className="relative inline-block">
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {trigger}
            </div>

            {open && (
                <div
                    className={cn(
                        "absolute right-0 mt-2 min-w-[180px] p-1 z-50",
                        "rounded-xl border",
                        "bg-[color:var(--card)]/80 backdrop-blur-xl",
                        "border-[color:var(--border)]",
                        "shadow-[var(--shadow-elevated)]",
                        "origin-top-right animate-in",
                        className
                    )}
                >
                    {items.map((item, i) => {
                        if (item.divider) {
                            return (
                                <div
                                    key={`divider-${i}`}
                                    className="my-1 border-t border-[color:var(--border)]"
                                />
                            );
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    item.onClick?.();
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg",
                                    "transition interactive",
                                    "text-[color:var(--foreground)]",
                                    "hover:bg-[color:var(--secondary)]",
                                    item.variant === "danger" &&
                                    "text-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/10"
                                )}
                            >
                                {item.icon && (
                                    <item.icon
                                        className={cn(
                                            "w-4 h-4",
                                            "text-[color:var(--muted-foreground)]",
                                            "transition-transform duration-200 group-hover:scale-110",
                                            item.variant === "danger" &&
                                            "text-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/10"
                                        )}
                                    />
                                )}

                                <span className="whitespace-nowrap">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
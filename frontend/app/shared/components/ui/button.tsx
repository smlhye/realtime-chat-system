"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants = {
    primary:
        "gradient-primary text-white shadow-soft hover:opacity-90",

    secondary:
        "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:bg-[color:var(--muted)]",

    outline:
        "border border-[color:var(--border)] hover:bg-[color:var(--muted)]",

    ghost:
        "hover:bg-[color:var(--muted)]",

    danger:
        "bg-[color:var(--destructive)] text-[color:var(--destructive-foreground)] hover:opacity-90",
};

const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
                    "interactive focus-ring",
                    variants[variant],
                    sizes[size],
                    (disabled || isLoading) && "opacity-50 cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
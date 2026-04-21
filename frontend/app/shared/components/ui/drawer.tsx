"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/app/lib/cn";

type Variant = "default" | "bordered";

interface Props extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    variant?: Variant;
    onClose?: () => void;
}

export default function Drawer({
    open = true,
    variant = "default",
    className,
    children,
    onClose,
    ...props
}: Props) {
    const panelBase =
        "h-full w-[380px] bg-[rgb(var(--color-card))] transition-transform duration-300 ease-out shadow-[-4px_0_12px_rgba(15,23,42,0.06)]";

    const variants: Record<Variant, string> = {
        default: "",
        bordered: "border-l border-[rgb(var(--color-border))]",
    };

    return (
        <div
            className={cn(
                "absolute inset-0 z-50 flex justify-end transition-opacity",
                open ? "opacity-100 visible" : "opacity-0 invisible"
            )}
        >
            {/* Overlay */}
            <div
                onClick={onClose}
                className="flex-1"
            />

            {/* Panel */}
            <div
                className={cn(
                    panelBase,
                    variants[variant],
                    open ? "translate-x-0" : "translate-x-full",
                    className
                )}
                {...props}
            >
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
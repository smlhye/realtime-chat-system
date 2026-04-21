"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/app/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    "bg-[color:var(--input)]",
                    "text-[color:var(--foreground)]",
                    "placeholder:text-[color:var(--muted-foreground)]",
                    "placeholder:opacity-100",
                    "transition-colors duration-200",

                    "focus-ring outline-none",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
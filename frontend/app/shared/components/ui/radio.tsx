"use client";

import { forwardRef } from "react";
import { cn } from "@/app/lib/cn";

export const Radio = forwardRef<HTMLInputElement, any>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    ref={ref}
                    type="radio"
                    className={cn(
                        "size-4",
                        "accent-[color:var(--primary)]",
                        "transition hover:scale-110",
                        className
                    )}
                    {...props}
                />
                {label && (
                    <span className="text-sm text-[color:var(--foreground)]">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Radio.displayName = "Radio";
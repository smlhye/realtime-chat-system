"use client";

import { cn } from "@/app/lib/cn";
import { useThemeStore } from "@/app/stores/theme.store";
import { themes } from "@/app/types/theme.type";

export function ThemeToggle() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div
            className={cn(
                "relative flex items-center gap-1 p-1 rounded-xl",
                "border border-[color:var(--border)]",
                "bg-[color:var(--card)]/80 backdrop-blur-xl",
                "shadow-soft"
            )}
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const active = theme === key;

                return (
                    <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className={cn(
                            "relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
                            "transition-all duration-200",
                            "interactive",
                            active
                                ? "text-white"
                                : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)]/60 hover:text-[color:var(--foreground)]"
                        )}
                    >
                        <Icon className="size-4" />
                        {label}

                        {active && (
                            <span
                                className={cn(
                                    "absolute inset-0 -z-10 rounded-lg",
                                    "gradient-primary",
                                    "shadow-soft",
                                    "animate-in"
                                )}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
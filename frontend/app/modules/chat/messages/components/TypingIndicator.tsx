import { cn } from "@/app/lib/cn";

export function TypingIndicator({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2">
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full",
                    "glass shadow-soft animate-in"
                )}
            >
                <div className="flex items-center gap-1 h-4">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                </div>

                <span
                    className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        "text-[color:var(--muted-foreground)]"
                    )}
                >
                    {text}
                </span>
            </div>
        </div>
    );
}
import { cn } from "@/app/lib/cn";

const getInitials = (name: string) => {
    if (!name) return "?"

    const normalized = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

    const clean = normalized
        .replace(/[^\p{L}0-9\s]/gu, " ")
        .trim()

    const words = clean.split(/\s+/).filter(Boolean)

    if (words.length === 0) return "?"
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

    return (words[0][0] + words[1][0]).toUpperCase()
}

const stringToColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return `hsl(${hash % 360}, 60%, 70%)`
}

export function Avatar({
    src,
    name,
    alt,
    className,
    online,
}: {
    src?: string;
    name?: string
    alt?: string;
    className?: string;
    online?: boolean;
}) {
    const fallbackText = getInitials(name || "")
    const bgColor = stringToColor(name || "default")
    return (
        <div
            className={cn(
                "relative size-10 shrink-0 rounded-full overflow-hidden",
                "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]",
                "flex items-center justify-center",
                "ring-1 ring-[color:var(--border)]",
                "interactive",
                "hover:ring-2 hover:ring-[color:var(--ring)]",
                className
            )}
            style={{
                backgroundColor: !src ? bgColor : undefined,
            }}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="size-full object-cover"
                />
            ) : (
                <span className="text-sm font-medium text-white">
                    {fallbackText}
                </span>
            )}

            {online && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 size-2.5 rounded-full",
                        "bg-[color:var(--primary)]",
                        "ring-2 ring-[color:var(--background)]",
                        "pulse-soft"
                    )}
                />
            )}
        </div>
    );
}
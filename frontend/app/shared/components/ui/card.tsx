import { cn } from "@/app/lib/cn";

export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-xl border p-4",
                "bg-[color:var(--card)]/80 backdrop-blur-xl",
                "transition-all",
                className
            )}
            {...props}
        />
    );
}
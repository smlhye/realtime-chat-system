import { cn } from "@/app/lib/cn";

export type Variant = "default" | "success" | "warning" | "danger";

const variants = {
    default:
        "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]",

    success:
        "bg-[color:var(--primary)]/90 text-white",

    warning:
        "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",

    danger:
        "bg-[color:var(--destructive)] text-[color:var(--destructive-foreground)]",
};

export function Badge({
    className,
    variant = "default",
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md",
                "backdrop-blur-md",
                "transition-all duration-200",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
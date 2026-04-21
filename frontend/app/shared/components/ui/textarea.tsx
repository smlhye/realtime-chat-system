import React, {
    forwardRef,
    useCallback,
    useLayoutEffect,
    useRef,
} from "react";
import { cn } from "@/app/lib/cn";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    maxRows?: number;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ className, value, onChange, maxRows = 5, style, ...props }, ref) => {
        const innerRef = useRef<HTMLTextAreaElement | null>(null);

        const setRef = useCallback(
            (el: HTMLTextAreaElement | null) => {
                innerRef.current = el;

                if (typeof ref === "function") ref(el);
                else if (ref) (ref as any).current = el;
            },
            [ref]
        );

        const resize = useCallback(() => {
            const el = innerRef.current;
            if (!el) return;

            // reset height để đo lại chính xác
            el.style.height = "auto";

            const computed = window.getComputedStyle(el);

            const lineHeight = parseFloat(computed.lineHeight || "20");
            const paddingTop = parseFloat(computed.paddingTop || "0");
            const paddingBottom = parseFloat(computed.paddingBottom || "0");

            const maxContentHeight = lineHeight * maxRows;

            // scrollHeight bao gồm padding → cần trừ ra
            const contentHeight =
                el.scrollHeight - paddingTop - paddingBottom;

            const finalContentHeight = Math.min(
                contentHeight,
                maxContentHeight
            );

            el.style.height = `${finalContentHeight + paddingTop + paddingBottom}px`;

            // luôn giữ scroll ở bottom khi typing dài
            el.scrollTop = el.scrollHeight;
        }, [maxRows]);

        useLayoutEffect(() => {
            resize();
        }, [value, resize]);

        return (
            <textarea
                ref={setRef}
                value={value}
                onChange={(e) => {
                    onChange?.(e);
                    requestAnimationFrame(resize);
                }}
                rows={1}
                style={style}
                className={cn(
                    // layout base
                    "flex w-full resize-none overflow-hidden box-border",

                    // sizing
                    "min-h-[42px] max-h-[200px]",

                    // spacing (IMPORTANT FIX padding perception)
                    "px-3 py-[10px]",

                    // typography (FIX visual alignment)
                    "text-sm leading-[20px]",

                    // visuals
                    "rounded-md",
                    "border border-[color:var(--border)]",
                    "bg-[color:var(--card)]",
                    "text-[color:var(--foreground)]",
                    "placeholder:text-[color:var(--muted-foreground)]",

                    // focus
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",

                    // states
                    "disabled:cursor-not-allowed disabled:opacity-50",

                    // animation (smooth height grow)
                    "transition-[height] duration-150 ease-out",

                    // scrollbar hidden (chat style)
                    "scrollbar-chat",

                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";
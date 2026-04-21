'use client';

import { useEffect, useRef, useState } from "react";

export function useMessageScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onScroll = () => {
            const scrollBottom = -el.scrollTop;
            const next = scrollBottom > 80;

            setShowScrollBtn((prev) => {
                if (prev === next) return prev;
                return next;
            });
        };

        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToBottom = () => {
        containerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const isAtBottom = () => {
        const el = containerRef.current;
        if(!el) return true;
        return -el.scrollTop < 80;
    }

    return {
        containerRef,
        showScrollBtn,
        scrollToBottom,
        isAtBottom,
    };
}
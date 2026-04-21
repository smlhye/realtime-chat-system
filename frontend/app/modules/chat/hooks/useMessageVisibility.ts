import { useEffect, useRef } from "react";

export function useMessageVisibility(onVisible: (tempId: string) => void) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const elementsRef = useRef(new Map<string, HTMLElement>());

    const register = (el: HTMLElement | null, tempId: string) => {
        const observer = observerRef.current;
        if (!observer) return;

        const prev = elementsRef.current.get(tempId);

        if (prev && prev !== el) {
            observer.unobserve(prev);
        }

        if (!el) return;

        elementsRef.current.set(tempId, el);
        observer.observe(el);
    };

    const seenRef = useRef(new Set<string>());
    
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const tempId = entry.target.getAttribute("data-id");
                    if (!tempId) return;

                    if (!entry.isIntersecting) return;

                    if (seenRef.current.has(tempId)) return;

                    seenRef.current.add(tempId);
                    onVisible(tempId);
                });
            },
            {
                threshold: 0.6,
            }
        );

        return () => observerRef.current?.disconnect();
    }, []);

    return { register };
}
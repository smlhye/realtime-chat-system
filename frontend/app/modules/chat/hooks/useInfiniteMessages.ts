'use client';

import { useEffect, useRef } from "react";

type Params = {
    hasMore: boolean;
    loadingMore: boolean;
    loadMore: () => void;
    rootRef: React.RefObject<HTMLDivElement | null>
};

export function useInfiniteMessages({
    hasMore,
    loadingMore,
    loadMore,
    rootRef,
}: Params) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            {
                root: rootRef.current,
                threshold: 0.1,
            }
        );

        const el = loadMoreRef.current;
        if (el) observer.observe(el);

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loadMore]);

    return { loadMoreRef };
}
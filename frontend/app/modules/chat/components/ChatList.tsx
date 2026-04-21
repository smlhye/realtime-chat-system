import { usePathname } from "next/navigation";
import { ChatsResponseType } from "../schemas/chats-response.schema";
import { useEffect, useRef } from "react";
import ChatItem from "./ChatItem";
import { CreateChatResponse } from "@/app/schemas/generated/type";

type Props = {
    chats: ChatsResponseType,
    loadMore: () => void,
    loadingMore: boolean,
    hasMore?: boolean,
}

export default function ChatList({ chats, loadMore, loadingMore, hasMore }: Props) {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isActive = (id?: string) => {
        const parts = pathname?.split("/") || [];
        return parts[2] === String(id);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            {
                root: containerRef.current,
                threshold: 1,
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loadMore]);

    return (
        <nav className="flex flex-col gap-1 h-full overflow-y-auto scrollbar-hidden p-3">
            {chats.map((chat: CreateChatResponse, index: number) => (
                <ChatItem key={chat.id} chat={chat} index={index} active={isActive(chat.id)} />
            ))}
            <div ref={loadMoreRef} />
            {loadingMore && (
                <p className="text-center text-sm py-2">Loading...</p>
            )}
        </nav>
    );
}
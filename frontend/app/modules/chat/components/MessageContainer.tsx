'use client';

import { cn } from "@/app/lib/cn";
import { ArrowDown } from "lucide-react";
import { useGetMessages } from "../hooks/useGetMessages";
import { MessageList } from "../messages/components/MessageList";
import { useInfiniteMessages } from "../hooks/useInfiniteMessages";
import { useMessageScroll } from "../hooks/useMessageScroll";
import { MessageError } from "../messages/components/MessageError";
import { useChatRoom } from "../hooks/useChatRoom";
import { useMessages } from "../hooks/useMessages";
import { ChatMobileHeader } from "../messages/components/ChatHeader";
import { MessageInput } from "../messages/components/MessageInput";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import { TypingIndicator } from "../messages/components/TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { useUnreadMessages } from "../hooks/useUnreadMessages";

type Props = {
    chatId: string;
};

function MessageLoading() {
    return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            Đang tải tin nhắn...
        </div>
    );
}

export default function MessageContainer({ chatId }: Props) {
    const {
        messages: apiMessages,
        loadMore,
        hasMore,
        loadingMore,
        isError,
        error,
    } = useGetMessages({ chatId });

    const {
        messages,
        addMessage,
        updateMessage,
        findMessage,
    } = useMessages({ chatId, initialMessages: apiMessages });

    useChatRoom({ chatId });

    const {
        containerRef,
        showScrollBtn,
        scrollToBottom,
        isAtBottom,
    } = useMessageScroll();

    const { loadMoreRef } = useInfiniteMessages({
        hasMore,
        loadingMore,
        loadMore,
        rootRef: containerRef,
    });

    const { typingText, isTyping } = useTypingIndicator(chatId);

    const { unreadCount, clearUnread } = useUnreadMessages({
        messages,
        isAtBottom,
        scrollToBottom,
        updateMessage
    });

    if (isError) {
        return <MessageError error={error} />;
    }

    if (!messages || messages.length === 0 && loadingMore) {
        return <MessageLoading />;
    }

    return (
        <div className="flex flex-col h-full bg-[color:var(--background)]">
            <ChatMobileHeader title="Tin nhắn" />
            <div className="relative flex-1 min-h-0">
                <div
                    ref={containerRef}
                    className={cn(
                        "h-full overflow-y-auto",
                        "px-4 py-4",
                        "flex flex-col-reverse",
                        "gap-1",
                        "scrollbar-modern"
                    )}
                >
                    <MessageList
                        messages={messages}
                        loadMoreRef={loadMoreRef}
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                        chatId={chatId}
                        updateMessage={updateMessage}
                    />
                </div>
                {isTyping && (
                    <div className="absolute bottom-0 z-10">
                        <TypingIndicator text={typingText} />
                    </div>
                )}
            </div>

            <div
                className={cn(
                    "absolute bottom-20 right-4 transition-all",
                    (showScrollBtn || unreadCount > 0)
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                )}
            >
                <button
                    onClick={() => {
                        scrollToBottom();
                        clearUnread();
                    }}
                    className={cn(
                        "p-2 rounded-full",
                        "bg-[color:var(--card)]",
                        "shadow-soft",
                        "border border-[color:var(--border)]",
                        "interactive",
                        "flex items-center gap-1",
                        unreadCount > 0 && "px-3"
                    )}
                >
                    {unreadCount > 0 ? (
                        <span className="flex items-center gap-2 text-xs">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>

                            Bạn có {unreadCount} tin mới
                        </span>
                    ) : (
                        <ArrowDown className="w-4 h-4" />
                    )}
                </button>
            </div>

            <MessageInput chatId={chatId} addMessage={addMessage} updateMessage={updateMessage} findMessage={findMessage} />
        </div>
    );
}
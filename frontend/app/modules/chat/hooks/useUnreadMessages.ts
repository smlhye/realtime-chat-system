import { useEffect, useRef, useState } from "react";
import { Message } from "../types/message.type";

export function useUnreadMessages({
    messages,
    isAtBottom,
    scrollToBottom,
    updateMessage,
}: {
    messages: Message[];
    isAtBottom: () => boolean;
    scrollToBottom: () => void;
    updateMessage: (tempId: string, msg: Partial<Message> | ((m: Message) => Message)) => void;
}) {
    const [unreadCount, setUnreadCount] = useState(0);
    const lastMessageKeyRef = useRef<string | null>(null);
    const getMessageKey = (m: Message) => m.id ?? m.tempId;
    useEffect(() => {
        if (!messages.length) return;
        const latest = messages[0];
        if (!latest) return;

        const key = getMessageKey(latest);
        if (key && key === lastMessageKeyRef.current) return;
        lastMessageKeyRef.current = key;
        if (latest.isMe) {
            scrollToBottom();
            return;
        }
        if (isAtBottom()) {
            scrollToBottom();
            updateMessage(latest.tempId, {
                justReceived: false,
            })
        } else {
            setUnreadCount((prev) => prev + 1);
        }
    }, [messages]);

    const clearUnread = () => setUnreadCount(0);

    return {
        unreadCount,
        clearUnread,
    };
}
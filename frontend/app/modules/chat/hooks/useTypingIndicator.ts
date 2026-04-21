'use client';

import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../contexts/chat-websocket.context";

type TypingUser = {
    userId: string;
    fullName: string;
};

export function useTypingIndicator(chatId: string) {
    const { socket } = useWebSocket();

    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const stopTimerRef = useRef<NodeJS.Timeout | null>(null);

    const startTyping = () => {
        if (!socket) return;

        socket.emit("typing", { chatId });

        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                socket.emit("typing", { chatId });
            }, 2000);
        }

        if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
        }

        stopTimerRef.current = setTimeout(() => {
            stopTyping();
        }, 2000);
    };

    const stopTyping = () => {
        if (!socket) return;

        socket.emit("stop_typing", { chatId });

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
            stopTimerRef.current = null;
        }
    };

    useEffect(() => {
        if (!socket) return;

        const removeTypingUser = (userId: string) => {
            setTypingUsers((prev) => prev.filter(u => u.userId !== userId));
        };

        const handleTyping = (user: TypingUser) => {
            setTypingUsers((prev) => {
                const exists = prev.find(u => u.userId === user.userId);
                if (exists) return prev;
                return [...prev, user];
            });
        };

        const handleStopTyping = (user: TypingUser) => {
            removeTypingUser(user.userId);
        };

        socket.on("user_typing", handleTyping);
        socket.on("user_stop_typing", handleStopTyping);

        return () => {
            socket.off("user_typing", handleTyping);
            socket.off("user_stop_typing", handleStopTyping);
        };
    }, [socket]);

    const names = typingUsers.map(u => u.fullName);

    return {
        typingUsers: names,
        isTyping: names.length > 0,
        typingText: names.join(", ") + " đang soạn tin nhắn",
        startTyping,
        stopTyping,
    };
}
'use client';

import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/chat-websocket.context";
import { MessagesResponseType } from "../schemas/messages-response.schema";
import { SendMessageResponse } from "@/app/schemas/generated/type";
import { Message } from "../types/message.type";
import { useUserStore } from "@/app/stores/user.store";

export function useMessages({
    chatId,
    initialMessages,
}: {
    chatId: string;
    initialMessages: MessagesResponseType;
}) {
    const { socket } = useWebSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const user = useUserStore((s) => s.user);

    useEffect(() => {
        if (!initialMessages?.length) return;

        setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));

            const newOnes = initialMessages.filter(
                (m) => !existingIds.has(m.id)
            );

            if (newOnes.length === 0) return prev;

            return [
                ...prev,
                ...newOnes.map((m) => ({
                    ...m,
                    tempId: m.tempId!,
                    status: "sent" as const,
                    justReceived: false,
                })),
            ];
        });
    }, [initialMessages]);

    useEffect(() => {
        if (!socket) return;

        const handleReceived = (msg: SendMessageResponse) => {
            console.log(msg)
            if (msg.chatId !== chatId) return;

            setMessages((prev) => {
                const isOptimisticUpdate = prev.some(
                    (m) => m.tempId && msg.tempId && m.tempId === msg.tempId
                );
                if (isOptimisticUpdate) {
                    const updated = prev.map((m) => {
                        if (m.tempId && msg.tempId && m.tempId === msg.tempId) {
                            return {
                                ...m,
                                ...msg,
                                tempId: m.tempId!,
                                status: "sent" as const,
                                justReceived: false,
                            };
                        }
                        return m;
                    });
                    return updated;
                }
                const newMessages = [
                    {
                        ...msg,
                        isMe: msg.senderId === user?.id,
                        tempId: msg.tempId!,
                        status: "sent" as const,
                        justReceived: true,
                    },
                    ...prev,
                ];

                return newMessages;
            });
        };

        socket.on("message_received", handleReceived);
        return () => {
            socket.off("message_received", handleReceived);
        };
    }, [socket, chatId]);

    const addMessage = (msg: Omit<Message, "status">) => {
        setMessages((prev) => [
            {
                ...msg,
                status: "sending",
                justReceived: false,
            },
            ...prev,
        ]);
    };

    const updateMessage = (
        tempId: string,
        updater: Partial<Message> | ((m: Message) => Message)
    ) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m.tempId !== tempId) return m;
                if (typeof updater === "function") {
                    return updater(m);
                }
                return { ...m, ...updater };
            })
        );
    };

    const findMessage = (tempId: string) => {
        return messages.find(m => m.tempId === tempId);
    }

    return {
        messages,
        setMessages,
        addMessage,
        updateMessage,
        findMessage,
    };
}
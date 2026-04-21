'use client';

import { useEffect } from "react";
import { useWebSocket } from "../contexts/chat-websocket.context";

export const useChatRoom = ({ chatId }: { chatId: string }) => {
    const { socket } = useWebSocket();
    useEffect(() => {
        if (!socket || !chatId) return;

        const join = () => {
            console.log("Joined chat:", chatId);
            socket.emit("join_chat", { chatId });
        };

        socket.on("connect", join);
        if (socket.connected) {
            join();
        }

        return () => {
            socket.emit("leave_chat", { chatId });
            socket.off("connect", join);
        };
    }, [socket, chatId]);
};
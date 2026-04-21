'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type WebsocketContextType = {
    socket: Socket | null;
};

const WebsocketContext = createContext<WebsocketContextType>({ socket: null });

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            withCredentials: true,
            transports: ['websocket'],
        });
        setSocket(s);
        s.on('connect', () => {
            console.log('Chat WebSocket connected', s.id);
        });
        s.on('disconnect', () => {
            console.log('Chat WebSocket disconnected');
        });
        return () => {
            s.disconnect();
        };
    }, []);
    return (
        <WebsocketContext.Provider value={{ socket }}>
            {children}
        </WebsocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebsocketContext);
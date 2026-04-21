'use client';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { WebSocketProvider } from "./modules/chat/contexts/chat-websocket.context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WebSocketProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WebSocketProvider>
    )
}
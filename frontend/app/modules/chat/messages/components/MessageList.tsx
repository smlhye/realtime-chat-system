import { Loader2 } from "lucide-react";
import { MessageItem } from "./MessageItem";
import { formatDate, isSameDay } from "@/app/utils/time.utils";
import { SendMessageResponse } from "@/app/schemas/generated/type";
import { Message } from "../../types/message.type";
import { useWebSocket } from "../../contexts/chat-websocket.context";
import { useMessageVisibility } from "../../hooks/useMessageVisibility";

export function MessageList({
    messages,
    loadMoreRef,
    hasMore,
    loadingMore,
    chatId,
    updateMessage,
}: any) {
    const { socket } = useWebSocket();
    const onMessageVisible = (tempId: string) => {
        setTimeout(() => {
            updateMessage(tempId, {
                justReceived: false,
            });
        }, 3000);
    }
    const { register } = useMessageVisibility(onMessageVisible);
    const retrySend = (msg: Message) => {
        if (!socket) return;
        const tempId = msg.tempId;
        updateMessage(tempId, {
            status: 'sending',
        });

        socket?.emit("send_message", {
            chatId,
            content: msg.content,
            tempId,
        });

        const timer = setTimeout(() => {
            updateMessage(tempId, {
                status: "failed",
            });
        }, 10000);

        return () => clearTimeout(timer);
    }
    return (
        <>
            {messages.map((msg: SendMessageResponse, index: number) => {
                const date = new Date(msg.createdAt!);

                const prevMsg = messages[index - 1];
                const nextMsg = messages[index + 1];

                const showDate =
                    !nextMsg ||
                    !isSameDay(
                        new Date(nextMsg.createdAt!),
                        date
                    );

                return (
                    <div key={msg.tempId || msg.id} className="flex flex-col animate-in">

                        {showDate && (
                            <div className="text-center text-xs text-[color:var(--muted-foreground)]">
                                {date.toDateString() === new Date().toDateString()
                                    ? "Hôm nay"
                                    : formatDate(date)}
                            </div>
                        )}

                        <div
                            data-id={msg.tempId}
                            ref={(el) => register(el, msg.tempId!)} 
                            // className=" max-width-[60%]"
                            >
                            <MessageItem
                                msg={msg}
                                prevMsg={prevMsg}
                                nextMsg={nextMsg}
                                onRetry={retrySend}
                            />
                        </div>
                    </div>
                );
            })}

            {hasMore && (
                <div
                    ref={loadMoreRef}
                    className="py-3 text-center text-xs text-[color:var(--muted-foreground)]"
                >
                    {loadingMore ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang tải tin nhắn...
                        </div>
                    ) : (
                        "Kéo lên để tải tin nhắn"
                    )}
                </div>
            )}
        </>
    );
}
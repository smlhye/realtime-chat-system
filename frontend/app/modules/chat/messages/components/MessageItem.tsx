import { cn } from "@/app/lib/cn";
import { Avatar } from "@/app/shared/components/ui";
import { Loader2, RotateCcw } from "lucide-react";

export function MessageItem({
    msg,
    prevMsg,
    nextMsg,
    onRetry,
}: any) {
    const date = new Date(msg.createdAt);

    const isSameNext = prevMsg?.senderId === msg.senderId;
    const isSamePrev = nextMsg?.senderId === msg.senderId;

    const isSending = msg.status === "sending";
    const isFailed = msg.status === "failed";

    const isNew = msg.justReceived;

    return (
        <div
            className={cn(
                "flex items-start gap-2",
                msg.isMe && "flex-row-reverse",
                !isSamePrev && "mt-2"
            )}
        >
            {!msg.isMe && (
                <div className="shrink-0 w-10 flex justify-center">
                    {isSamePrev ? (
                        <div className="size-10" />
                    ) : (
                        <Avatar name={msg.senderName} />
                    )}
                </div>
            )}

            <div className={cn(
                "flex items-center gap-2 max-w-[70%]",
                msg.isMe && "ml-auto flex-row-reverse"
            )}>

                {isSending && msg.isMe && (
                    <Loader2 className="w-3 h-3 text-[color:var(--muted-foreground)] animate-spin" />
                )}

                {isFailed && msg.isMe && (
                    <button
                        onClick={() => onRetry?.(msg)}
                        className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 hover:bg-red-500/20 transition"
                        title="Gửi lại"
                    >
                        <RotateCcw className="w-3 h-3 text-red-500" />
                    </button>
                )}

                <div
                    className={cn(
                        "px-3 py-2 text-sm shadow-soft break-words transition-all",
                        msg.isMe ? "chat-bubble-user" : "chat-bubble-bot",
                        msg.isMe ? "bg-[color:var(--chat-user)]" : "bg-[color:var(--chat-bot)]",
                        "rounded-xl",
                        isSending && "opacity-70",
                        isFailed && "opacity-60 border border-red-400/30",
                        isNew && "!bg-[color:var(--primary)]/10 !ring-1 !ring-[color:var(--primary)] animate-pulse"
                    )}
                >
                    {!msg.isMe && !isSamePrev && (
                        <div className="text-xs opacity-70 mb-1">
                            {msg.senderName}
                        </div>
                    )}

                    <div className="leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                    </div>

                    <div className="text-[10px] opacity-60 mt-1 text-right flex items-center justify-end gap-1">
                        {isFailed && (
                            <span className="text-red-500 font-bold">Gửi lỗi</span>
                        )}

                        <span>
                            {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
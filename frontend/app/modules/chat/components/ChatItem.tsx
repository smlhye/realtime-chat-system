import { cn } from "@/app/lib/cn"
import { CreateChatResponse } from "@/app/schemas/generated/type"
import { Avatar } from "@/app/shared/components/ui"
import Link from "next/link"

type ChatItemProps = {
    chat: CreateChatResponse
    active: boolean
    index: number
}

export default function ChatItem({ chat, active, index }: ChatItemProps) {
    return (
        <Link
            href={`/chats/${chat.id}`}
            className={cn(
                "flex items-center gap-2 px-3 py-2 pr-10 rounded-md text-sm font-medium relative group overflow-hidden interactive animate-in",
                "transition-colors",
                active
                    ? "surface-2 text-[color:var(--primary)]"
                    : "text-[color:var(--muted-foreground)] hover-surface hover:text-[color:var(--foreground)]"
            )}
            style={{
                animationDelay: `${index * 40}ms`,
                animationFillMode: "both",
            }}
        >
            <div className="w-6 h-6 flex items-center justify-center rounded-sm overflow-hidden shadow-soft">
                <Avatar name={chat.name} />
            </div>

            <span className="truncate flex-1">
                {chat.name}
            </span>
        </Link>
    )
}
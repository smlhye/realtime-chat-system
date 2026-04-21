'use client'

import { useState } from "react"
import { Search } from "lucide-react"

import { useDebounced } from "@/app/shared/hooks/useDebounced"
import { useGetChats } from "../hooks/useGetChats"
import ChatList from "./ChatList"
import { Input } from "@/app/shared/components/ui"
import { cn } from "@/app/lib/cn"

export default function ChatContainer() {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounced(search, 300)

    const { chats, loadMore, hasMore, loadingMore } = useGetChats({
        name: debouncedSearch || undefined,
        take: 20,
    })

    return (
        <div className="h-full flex flex-col bg-[color:var(--card)]">
            <div className="p-3 border-b border-[color:var(--border)]">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
                    <Input
                        id="search-chat"
                        name="search-chat"
                        placeholder="Tìm cuộc trò chuyện..."
                        onChange={(e) => setSearch(e.target.value)}
                        className={cn(
                            "pl-9",
                            "bg-[color:var(--input)]",
                            "border-[color:var(--border)]",
                            "focus:ring-0 focus-visible:shadow-[0_0_0_2px_var(--ring)]",
                            "transition-all"
                        )}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ChatList
                    chats={chats}
                    loadMore={loadMore}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                />
            </div>
        </div>
    )
}
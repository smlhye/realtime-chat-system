"use client";

import { usePathname } from "next/navigation";
import ChatContainer from "@/app/modules/chat/components/ChatContainer";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isChatList = pathname === "/chats";
    const isChatDetail = pathname.startsWith("/chats/") && pathname !== "/chats";

    return (
        <div className="flex flex-1 min-h-0 h-full bg-[color:var(--background)] text-[color:var(--foreground)]">

            {/* SIDEBAR */}
            <aside
                className={`
                    w-[280px] shrink-0 border-r border-[color:var(--border)] surface-1 h-full
                    ${isChatList ? "block w-full" : "hidden"}
                    md:block
                `}
            >
                <ChatContainer />
            </aside>

            {/* CONTENT */}
            <section
                className={`
                    flex-1 min-h-0 h-full overflow-hidden
                    ${isChatDetail ? "block" : "hidden"}
                    md:block
                `}
            >
                <div className="h-full flex flex-col">
                    {children}
                </div>
            </section>

        </div>
    );
}
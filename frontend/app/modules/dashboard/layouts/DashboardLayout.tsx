'use client';
import { cn } from "@/app/lib/cn";
import Header from "@/app/shared/components/layouts/header";
import { useState } from "react";
import { useMeQuery } from "../../user/hooks/useMeQuery";
import { useAuthGuard } from "@/app/shared/hooks/useAuthGuard";
import { Spinner } from "@/app/shared/components/ui";
import Loading from "@/app/shared/components/layouts/loading";
import Error from "@/app/shared/components/layouts/error";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data, isLoading, error } = useMeQuery();
    useAuthGuard(isLoading, data);
    // const [collapsed, setCollapsed] = useState(false);
    if (isLoading) return <Loading />;
    if (error) return <Error />;
    return (
        // <div className="flex h-screen overflow-hidden bg-[rgb(var(--color-background))]">
        //     {/* <Sidebar collapsed={collapsed} /> */}
        //     <div
        //         className={cn(
        //             "flex flex-col flex-1 min-h-screen transition-all duration-300",
        //         )}
        //     >
        //         <Header
        //         // onToggleSidebar={() => setCollapsed(!collapsed)}
        //         />
        //         <main className="flex-1 overflow-hidden">
        //             {children}
        //         </main>
        //     </div>
        // </div>
        <div className="h-screen flex flex-col overflow-hidden bg-[color:var(--background)]">

            {/* HEADER */}
            <Header />

            {/* MAIN AREA */}
            <main className="flex-1 min-h-0 overflow-hidden flex">
                {children}
            </main>

        </div>
    );
}
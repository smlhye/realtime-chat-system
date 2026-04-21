"use client";

import { ChevronDown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog, Dropdown } from "../ui";
import { useLogout } from "@/app/modules/auth/hooks/useLogout";
import { getUserMenu } from "@/app/modules/dashboard/constants/user-menu.constants";
import { useHeaderUI } from "../../hooks/useHeaderUI";
import { useUserStore } from "@/app/stores/user.store";

type Props = {
    onToggleSidebar?: () => void;
};

export default function Header({ onToggleSidebar }: Props) {
    const router = useRouter();
    const user = useUserStore((s) => s.user);
    const { showDialog, setShowDialog, rotate, setRotate } = useHeaderUI();
    const logoutMutation = useLogout();

    const handleLogout = () => { logoutMutation.mutate(undefined, { onSuccess: () => setShowDialog(false), }); };

    if (!user) return null;
    return (
        <header className="h-16 flex items-center justify-between px-3 border-b border-[color:var(--border)] bg-[color:var(--card)]">
            <div className="flex items-center gap-3">
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-md hover:bg-[color:var(--muted)] transition"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}

                <h2 className="text-sm font-medium text-[color:var(--foreground)]">
                    Real Chat
                </h2>
            </div>

            <div className="flex items-center gap-1 text-sm">
                <span className="text-[color:var(--muted-foreground)]">
                    Xin chào,
                </span>

                <span className="font-medium text-[color:var(--foreground)]">
                    {user?.fullName || "User"}
                </span>

                <Dropdown
                    className="w-[200px]"
                    trigger={
                        <button
                            onClick={() => setRotate(!rotate)}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[color:var(--muted)] transition"
                        >
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${rotate ? "rotate-180" : ""}`}
                            />
                        </button>
                    }
                    onTrigger={(close: boolean) => setRotate(close)}
                    items={getUserMenu(router, () => setShowDialog(true))}
                />
            </div>

            <ConfirmDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={handleLogout}
                confirmMessage="Bạn có muốn đăng xuất không?"
                description="Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng ứng dụng."
            />
        </header>
    );
}
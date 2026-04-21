import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation"

export type UserMenuItem = {
    icon?: React.ElementType;
    label?: string;
    onClick?: () => void;
    variant?: "default" | "danger";
    divider?: boolean;
};

export const getUserMenu = (
    router: ReturnType<typeof useRouter>,
    onLogout: () => void
): UserMenuItem[] => [
        {
            label: "Hồ sơ cá nhân",
            onClick: () => router.push("/"),
            icon: User
        },
        {
            label: "Cài đặt",
            onClick: () => router.push("/settings"),
            icon: Settings
        },
        {
            divider: true
        },
        {
            label: "Đăng xuất",
            onClick: onLogout,
            variant: "danger",
            icon: LogOut
        },
    ];
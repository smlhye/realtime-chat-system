import { Laptop, Moon, Sun } from "lucide-react";

export const themes = [
    {
        key: "light",
        icon: Sun,
        label: "Light",
    },
    {
        key: "dark",
        icon: Moon,
        label: "Dark",
    },
    {
        key: "system",
        icon: Laptop,
        label: "System",
    },
] as const;
import { create } from 'zustand';

type Theme = "light" | "dark" | "system";

type ThemeStore = {
    theme: Theme;
    resolvedTheme: "light" | "dark";

    setTheme: (theme: Theme) => void;
    initTheme: () => void,
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    theme: 'system',
    resolvedTheme: 'light',

    setTheme: (theme) => {
        localStorage.setItem('chat-theme', theme);
        const root = document.documentElement;
        let finalTheme: "light" | "dark";
        if (theme === "system") {
            finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        } else {
            finalTheme = theme;
        }
        root.classList.remove("light", "dark");
        root.classList.add(finalTheme);
        set({ theme, resolvedTheme: finalTheme });
    },

    initTheme: () => {
        const stored = localStorage.getItem("task-theme") as Theme | null;
        const theme = stored || "system";
        get().setTheme(theme);
    },
}))
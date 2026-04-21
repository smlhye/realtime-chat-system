'use client';

import { useThemeStore } from "@/app/stores/theme.store";
import { useEffect } from "react";

export function ThemeInit() {
    const initTheme = useThemeStore((s) => s.initTheme);
    useEffect(() => {
        initTheme();
    }, [initTheme]);
    return null;
}
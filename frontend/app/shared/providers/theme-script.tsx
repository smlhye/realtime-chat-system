export function ThemeScript() {
    const script = `
        (function() {
            try {
                const stored = localStorage.getItem('task-theme');
                const root = document.documentElement;

                function getSystemTheme() {
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                }

                const theme = stored || 'system';
                const finalTheme = theme === 'system' ? getSystemTheme() : theme;

                root.classList.add(finalTheme);
            } catch (e) {}
        })();
    `;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
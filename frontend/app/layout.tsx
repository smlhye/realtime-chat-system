import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';
import { ThemeScript } from './shared/providers/theme-script';
import { ThemeInit } from './shared/providers/theme-init';

export const metadata = {
    title: 'Realtime Chat System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScript />
            </head>
            <body>
                <Providers>
                    <ThemeInit />
                    <Toaster richColors position='top-right' />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
import { ThemeToggle } from "../shared/components/toggle/theme.toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            {children}
        </div>
    )
}
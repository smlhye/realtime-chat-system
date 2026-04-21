import { DashboardLayout } from "../modules/dashboard/layouts/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>{children}</DashboardLayout>
    )
}
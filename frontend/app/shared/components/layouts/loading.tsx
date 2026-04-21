import { Spinner } from "../ui"

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-6 py-5 shadow-sm animate-in">

                <Spinner />

                <p className="text-sm font-medium text-[color:var(--foreground)]">
                    Đang tải dữ liệu...
                </p>

                <p className="text-xs text-[color:var(--muted-foreground)]">
                    Vui lòng chờ trong giây lát
                </p>
            </div>
        </div>
    )
}
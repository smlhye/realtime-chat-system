import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-4">
            <div className="w-full max-w-md text-center">

                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[color:var(--muted)] text-2xl">
                    404
                </div>

                <h1 className="text-xl font-semibold text-[color:var(--foreground)]">
                    Không tìm thấy trang
                </h1>

                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                    Trang bạn đang tìm có thể đã bị xóa hoặc không tồn tại.
                </p>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">

                    <button
                        onClick={() => window.history.back()}
                        className="rounded-md border border-[color:var(--border)] px-4 py-2 text-sm hover:bg-[color:var(--muted)]"
                    >
                        Quay lại
                    </button>

                    <Link
                        href="/"
                        className="rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        Về trang chủ
                    </Link>

                </div>
            </div>
        </div>
    )
}
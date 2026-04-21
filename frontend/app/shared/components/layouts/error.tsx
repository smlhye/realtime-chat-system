export default function Error() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-4">
            <div className="w-full max-w-sm rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-center shadow-sm animate-in">

                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M10.29 3.86l-8.3 14.38A1.5 1.5 0 003.3 21h17.4a1.5 1.5 0 001.3-2.26l-8.3-14.38a1.5 1.5 0 00-2.42 0z"
                        />
                    </svg>
                </div>

                <h2 className="text-base font-semibold text-[color:var(--foreground)]">
                    Đã xảy ra lỗi
                </h2>

                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                    Không thể tải dữ liệu. Vui lòng thử lại hoặc kiểm tra kết nối mạng.
                </p>

                <div className="mt-5 flex flex-col gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Tải lại trang
                    </button>

                    <button
                        onClick={() => history.back()}
                        className="w-full rounded-md border border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--muted)]"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    )
}
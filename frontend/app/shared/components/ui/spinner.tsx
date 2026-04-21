import { Loader2 } from "lucide-react";

export function Spinner() {
    return (
        <Loader2 className="size-5 animate-spin text-[color:var(--primary)]" />
    );
}
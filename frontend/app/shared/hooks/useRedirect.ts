'use client';

import { useRouter } from "next/navigation";

export const useRedirect = () => {
    const router = useRouter();

    return {
        redirect: (url: string) => router.replace(url),
        push: (url: string) => router.push(url),
    };
};
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserResponse } from "@/app/schemas/generated/type";

export const useAuthGuard = (isLoading: boolean, user?: UserResponse) => {
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/sign-in");
        }   
    }, [isLoading, user, router]);
};
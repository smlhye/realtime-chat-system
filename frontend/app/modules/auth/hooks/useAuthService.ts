'use client'

import { useState } from "react";

export function useAuthService() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    return {
        showPassword,
        showConfirmPassword,

        setShowPassword,
        setShowConfirmPassword,
    }
}
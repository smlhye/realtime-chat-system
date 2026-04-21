'use client';

import { useState } from "react";

export const useHeaderUI = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [rotate, setRotate] = useState(false);

    return {
        showDialog,
        setShowDialog,
        rotate,
        setRotate,
    };
};
"use client";

import {
    useRef,
    useState,
    useEffect,
    forwardRef,
    KeyboardEvent,
    ClipboardEvent,
} from "react";
import { cn } from "@/app/lib/cn";

interface OtpInputProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(
    ({ length = 6, value = "", onChange, className }, ref) => {
        const [values, setValues] = useState<string[]>(
            Array(length).fill("")
        );

        const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
        useEffect(() => {
            if (value) {
                const arr = value.split("").slice(0, length);
                setValues(arr.concat(Array(length - arr.length).fill("")));
            }
        }, [value, length]);
        const updateValues = (vals: string[]) => {
            setValues(vals);
            onChange?.(vals.join(""));
        };

        const focusNextEmpty = () => {
            const nextIndex = values.findIndex((v) => v === "");
            if (nextIndex !== -1) {
                inputsRef.current[nextIndex]?.focus();
            } else {
                inputsRef.current[length - 1]?.focus();
            }
        };

        const handleChange = (index: number, val: string) => {
            if (!/^\d*$/.test(val)) return;

            const newValues = [...values];
            if (val.length > 1) {
                const digits = val.split("");
                let currentIndex = index;

                digits.forEach((digit) => {
                    if (currentIndex < length) {
                        newValues[currentIndex] = digit;
                        currentIndex++;
                    }
                });

                updateValues(newValues);

                const nextIndex = Math.min(
                    index + digits.length,
                    length - 1
                );
                inputsRef.current[nextIndex]?.focus();
                return;
            }

            newValues[index] = val;
            updateValues(newValues);

            // auto focus next
            if (val && index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        };

        const handleKeyDown = (
            e: KeyboardEvent<HTMLInputElement>,
            index: number
        ) => {
            if (e.key === "Backspace") {
                e.preventDefault();

                const newValues = [...values];

                if (newValues[index]) {
                    newValues[index] = "";
                } else if (index > 0) {
                    newValues[index - 1] = "";
                    inputsRef.current[index - 1]?.focus();
                }

                updateValues(newValues);
            }

            if (e.key === "ArrowLeft" && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }

            if (e.key === "ArrowRight" && index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        };

        const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text").replace(/\D/g, "");

            if (!text) return;

            const newValues = [...values];
            let i = 0;

            for (let j = 0; j < text.length && i < length; j++) {
                newValues[i] = text[j];
                i++;
            }

            updateValues(newValues);

            inputsRef.current[
                Math.min(text.length, length) - 1
            ]?.focus();
        };

        const handleClick = (index: number) => {
            const firstEmpty = values.findIndex((v) => v === "");

            if (firstEmpty !== -1) {
                inputsRef.current[firstEmpty]?.focus();
            } else {
                inputsRef.current[length - 1]?.focus();
            }
        };

        return (
            <div
                ref={ref}
                style={{
                    gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))`,
                }}
                className={cn("grid gap-2 w-full", className)}
                onClick={focusNextEmpty}
            >
                {values.map((value, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputsRef.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) =>
                            handleChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onClick={() => handleClick(index)}
                        className={cn(
                            "w-full aspect-square text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-ring))]"
                        )}
                    />
                ))}
            </div>
        );
    }
);

OtpInput.displayName = "OtpInput";
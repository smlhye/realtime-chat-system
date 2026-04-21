import { Send, Smile } from "lucide-react";
import { Textarea } from "@/app/shared/components/ui";
import { useChatInput } from "../../hooks/useChatInput";
import { Controller } from "react-hook-form";
import { cn } from "@/app/lib/cn";
import { Message } from "../../types/message.type";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { useState, useRef, useEffect } from "react";

export const MessageInput = ({
    chatId,
    addMessage,
    updateMessage,
    findMessage,
}: {
    chatId: string;
    addMessage: (msg: any) => void;
    updateMessage: (
        tempId: string,
        msg: Partial<Message> | ((m: Message) => Message)
    ) => void;
    findMessage: (tempId: string) => any;
}) => {
    const {
        control,
        value,
        onSubmit,
        handleChange,
        handleBlur,
        handleKeyDown,
        setValue,
    } = useChatInput({
        chatId,
        addMessage,
        updateMessage,
        findMessage,
    });

    const [openEmoji, setOpenEmoji] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(e.target as Node)
            ) {
                setOpenEmoji(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <form
            onSubmit={onSubmit}
            className={cn(
                "shrink-0 relative",
                "p-3",
                "border-t border-[color:var(--border)]",
                "bg-[color:var(--card)]/80",
                "backdrop-blur",
                "flex gap-2 items-end"
            )}
        >
            {/* TEXTAREA */}
            <Controller
                name="content"
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        onChange={(e) => {
                            field.onChange(e.target.value);
                            handleChange(e.target.value);
                        }}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1"
                        maxRows={6}
                    />
                )}
            />

            {/* EMOJI BUTTON */}
            <button
                type="button"
                onClick={() => setOpenEmoji((v) => !v)}
                className="p-2 rounded-lg hover:bg-[color:var(--surface-2)] transition"
            >
                <Smile className="w-4 h-4" />
            </button>

            {/* EMOJI PICKER */}
            {openEmoji && (
                <div
                    ref={pickerRef}
                    className="fixed bottom-24 right-20 z-[9999]"
                >
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                            const char =
                                emoji.native ||
                                emoji?.skins?.[0]?.native ||
                                "";

                            const current = value || "";
                            const next = current + char;

                            setValue("content", next, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });

                            setOpenEmoji(false);
                        }}
                    />
                </div>
            )}

            {/* SEND BUTTON */}
            <button
                type="submit"
                disabled={!value?.trim()}
                className={cn(
                    "p-2 rounded-lg",
                    "bg-[color:var(--primary)]",
                    "text-white",
                    "hover:opacity-90",
                    "transition",
                    "interactive",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
};
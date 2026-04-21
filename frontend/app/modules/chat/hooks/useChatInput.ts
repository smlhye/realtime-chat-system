import { useForm } from "react-hook-form";
import { useWebSocket } from "../contexts/chat-websocket.context";
import { useTypingIndicator } from "./useTypingIndicator";
import { SendMessage, SendMessageSchema } from "../schemas/send-message.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "../types/message.type";
import { v4 as uuidv4 } from "uuid";

export const useChatInput = ({
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
    const { socket } = useWebSocket();
    const { startTyping, stopTyping } = useTypingIndicator(chatId);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
    } = useForm<SendMessage>({
        resolver: zodResolver(SendMessageSchema),
        defaultValues: {
            content: "",
        },
    });

    const value = watch("content");

    const onSubmit = handleSubmit((data) => {
        const content = data.content.trim();
        if (!content) return;

        const tempId = uuidv4();

        addMessage({
            chatId,
            content,
            tempId,
            createdAt: new Date().toISOString(),
            isMe: true,
        });

        socket?.emit("send_message", {
            chatId,
            content,
            tempId,
        });

        setTimeout(() => {
            updateMessage(tempId, (m) => {
                if (m.status === "sending") {
                    return { ...m, status: "failed" };
                }
                return m;
            });
        }, 10000);

        stopTyping();
        reset();
    });

    const handleChange = (val: string) => {
        // optional sync typing indicator only
        if (!val.trim()) {
            stopTyping();
        } else {
            startTyping();
        }
    };

    const handleBlur = () => {
        stopTyping();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return {
        control,
        value,
        onSubmit,
        handleChange,
        handleBlur,
        handleKeyDown,
        setValue, // ⭐ IMPORTANT
    };
};
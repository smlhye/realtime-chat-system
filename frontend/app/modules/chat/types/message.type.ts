export type Message = {
    id?: string;
    senderId?: string;
    senderName?: string;
    chatId?: string;
    tempId: string;
    content?: string;
    createdAt?: string;
    isMe?: boolean;
    status: "sending" | "sent" | "failed";
    justReceived?: boolean,
};
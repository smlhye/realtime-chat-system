import { z } from "zod";

export const SendMessageSchema = z.object({
    content: z.string().min(1).max(5000),
});

export type SendMessage = z.infer<typeof SendMessageSchema>;
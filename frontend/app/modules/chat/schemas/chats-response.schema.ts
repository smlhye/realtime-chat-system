import { schemas } from "@/app/schemas/generated/client";
import z from "zod";

export const ChatsResponseSchema = z.array(schemas.CreateChatResponse);
export type ChatsResponseType = z.infer<typeof ChatsResponseSchema>
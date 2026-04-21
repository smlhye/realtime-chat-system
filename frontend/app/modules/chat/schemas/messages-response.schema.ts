import { schemas } from "@/app/schemas/generated/client";
import { z } from "zod";

export const MessagesResponse = z.array(schemas.SendMessageResponse);
export type MessagesResponseType = z.infer<typeof MessagesResponse>
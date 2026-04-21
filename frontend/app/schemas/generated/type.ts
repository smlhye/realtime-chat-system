import { z } from "zod";
import { schemas } from "./client";

export type SignInRequest = z.infer<typeof schemas.SignInRequest>
export type SignInResponse = z.infer<typeof schemas.SignInResponse>
export type SignUpRequest = z.infer<typeof schemas.SignUpRequest>
export type SignUpResponse = z.infer<typeof schemas.SignUpResponse>

export type UserResponse = z.infer<typeof schemas.UserResponse>

export type CreateChatRequest = z.infer<typeof schemas.CreateChatRequest>
export type CreateChatResponse = z.infer<typeof schemas.CreateChatResponse>
export type AddUserToChatRequest = z.infer<typeof schemas.AddUsersToChatRequest>
export type AddUserToChatResponse = z.infer<typeof schemas.AddUsersToChatResponse>
export type SendMessageRequest = z.infer<typeof schemas.SendMessageRequest>
export type SendMessageResponse = z.infer<typeof schemas.SendMessageResponse>
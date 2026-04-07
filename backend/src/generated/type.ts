import { z } from "zod";
import { schemas } from "./client";

export type SignInRequest = z.infer<typeof schemas.SignInRequest>
export type SignInResponse = z.infer<typeof schemas.SignInResponse>
export type SignUpRequest = z.infer<typeof schemas.SignUpRequest>
export type SignUpResponse = z.infer<typeof schemas.SignUpResponse>
export type UserResponse = z.infer<typeof schemas.UserResponse>
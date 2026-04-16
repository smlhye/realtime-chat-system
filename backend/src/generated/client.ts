// import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const SignUpRequest = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/),
    fullName: z.string(),
  })
  .passthrough();
const SignUpResponse = z
  .object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    fullName: z.string(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const SignInRequest = z
  .object({ username: z.string(), password: z.string() })
  .passthrough();
const SignInResponse = z
  .object({
    accessToken: z.string(),
    tokenType: z.string(),
    expiresAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const UserResponse = z
  .object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    fullName: z.string(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const CreateChatRequest = z
  .object({ name: z.string().optional(), users: z.array(z.string()) })
  .passthrough();
const CreateChatResponse = z
  .object({
    id: z.string(),
    name: z.string(),
    isGroup: z.boolean(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const AddUsersToChatRequest = z
  .object({ userIds: z.array(z.string()) })
  .passthrough();
const AddUsersToChatResponse = z
  .object({
    chatId: z.string(),
    users: z.array(
      z.object({ id: z.string(), userId: z.string() }).partial().passthrough(),
    ),
  })
  .partial()
  .passthrough();
const SendMessageRequest = z
  .object({ content: z.string(), tempId: z.string() })
  .passthrough();
const SendMessageResponse = z
  .object({
    id: z.string(),
    senderId: z.string(),
    chatId: z.string(),
    content: z.string(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();

export const schemas = {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  UserResponse,
  CreateChatRequest,
  CreateChatResponse,
  AddUsersToChatRequest,
  AddUsersToChatResponse,
  SendMessageRequest,
  SendMessageResponse,
};

// const endpoints = makeApi([
//   {
//     method: 'post',
//     path: '/auth/refresh',
//     alias: 'postAuthrefresh',
//     description: `Refreshes the access token using the HttpOnly refresh token cookie; no request body is needed`,
//     requestFormat: 'json',
//     response: SignInResponse,
//   },
//   {
//     method: 'post',
//     path: '/auth/sign-in',
//     alias: 'postAuthsignIn',
//     requestFormat: 'json',
//     parameters: [
//       {
//         name: 'body',
//         type: 'Body',
//         schema: SignInRequest,
//       },
//     ],
//     response: SignInResponse,
//     errors: [
//       {
//         status: 401,
//         description: `Invalid credentials`,
//         schema: z.void(),
//       },
//     ],
//   },
//   {
//     method: 'post',
//     path: '/auth/sign-out',
//     alias: 'postAuthsignOut',
//     requestFormat: 'json',
//     response: z.void(),
//   },
//   {
//     method: 'post',
//     path: '/auth/sign-out-all',
//     alias: 'postAuthsignOutAll',
//     requestFormat: 'json',
//     response: z.void(),
//   },
//   {
//     method: 'post',
//     path: '/auth/sign-up',
//     alias: 'postAuthsignUp',
//     requestFormat: 'json',
//     parameters: [
//       {
//         name: 'body',
//         type: 'Body',
//         schema: SignUpRequest,
//       },
//     ],
//     response: SignUpResponse,
//     errors: [
//       {
//         status: 400,
//         description: `Invalid input`,
//         schema: z.void(),
//       },
//     ],
//   },
//   {
//     method: 'post',
//     path: '/chats',
//     alias: 'postChats',
//     description: `Creates a new chat based on the isGroup flag, with an optional name for group chats.`,
//     requestFormat: 'json',
//     parameters: [
//       {
//         name: 'body',
//         type: 'Body',
//         schema: CreateChatRequest,
//       },
//     ],
//     response: CreateChatResponse,
//     errors: [
//       {
//         status: 401,
//         description: `Invalid credentials`,
//         schema: z.void(),
//       },
//     ],
//   },
//   {
//     method: 'post',
//     path: '/chats/:chatId/messages',
//     alias: 'postChatsChatIdmessages',
//     description: `Sends a message to the specified chat. The authenticated user must be a member of the chat`,
//     requestFormat: 'json',
//     parameters: [
//       {
//         name: 'body',
//         type: 'Body',
//         schema: SendMessageRequest,
//       },
//       {
//         name: 'chatId',
//         type: 'Path',
//         schema: z.string(),
//       },
//     ],
//     response: SendMessageResponse,
//     errors: [
//       {
//         status: 400,
//         description: `Invalid request payload`,
//         schema: z.void(),
//       },
//       {
//         status: 401,
//         description: `Invalid credentials`,
//         schema: z.void(),
//       },
//       {
//         status: 403,
//         description: `Forbidden (user is not a member of the chat)`,
//         schema: z.void(),
//       },
//       {
//         status: 404,
//         description: `Chat not found`,
//         schema: z.void(),
//       },
//     ],
//   },
//   {
//     method: 'get',
//     path: '/chats/:chatId/messages',
//     alias: 'getChatsChatIdmessages',
//     description: `Retrieve a paginated list of messages in a specific chat`,
//     requestFormat: 'json',
//     parameters: [
//       {
//         name: 'chatId',
//         type: 'Path',
//         schema: z.string(),
//       },
//       {
//         name: 'take',
//         type: 'Query',
//         schema: z.number().int().optional(),
//       },
//       {
//         name: 'cursor',
//         type: 'Query',
//         schema: z.string().datetime({ offset: true }).optional(),
//       },
//     ],
//     response: z.array(SendMessageResponse),
//     errors: [
//       {
//         status: 400,
//         description: `Invalid request payload`,
//         schema: z.void(),
//       },
//       {
//         status: 401,
//         description: `Invalid credentials`,
//         schema: z.void(),
//       },
//       {
//         status: 403,
//         description: `Forbidden (user is not a member of the chat)`,
//         schema: z.void(),
//       },
//       {
//         status: 404,
//         description: `Chat not found`,
//         schema: z.void(),
//       },
//     ],
//   },
//   {
//     method: 'post',
//     path: '/chats/:chatId/users',
//     alias: 'postChatsChatIdusers',
//     description: `Adds a user to the specified chat. The user must not already exist in the chat.`,
//     requestFormat: 'json',
//     parameters: [
//       {
//         name: 'body',
//         type: 'Body',
//         schema: AddUsersToChatRequest,
//       },
//       {
//         name: 'chatId',
//         type: 'Path',
//         schema: z.string(),
//       },
//     ],
//     response: AddUsersToChatResponse,
//     errors: [
//       {
//         status: 400,
//         description: `User already exists in the chat or invalid input`,
//         schema: z.void(),
//       },
//       {
//         status: 401,
//         description: `Invalid credentials`,
//         schema: z.void(),
//       },
//       {
//         status: 404,
//         description: `Chat or user not found`,
//         schema: z.void(),
//       },
//     ],
//   },
//   {
//     method: 'get',
//     path: '/users/me',
//     alias: 'getUsersme',
//     description: `Returns the currently authenticated user&#x27;s profile. Requires Bearer access token`,
//     requestFormat: 'json',
//     response: UserResponse,
//     errors: [
//       {
//         status: 401,
//         description: `Unauthorized, invalid or expired token`,
//         schema: z.void(),
//       },
//     ],
//   },
// ]);

// export const api = new Zodios(endpoints);

// export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
//   return new Zodios(baseUrl, endpoints, options);
// }

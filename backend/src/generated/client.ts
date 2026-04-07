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

export const schemas = {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  UserResponse,
};

// const endpoints = makeApi([
//   {
//     method: 'get',
//     path: '/api/me',
//     alias: 'getApime',
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
// ]);

// export const api = new Zodios(endpoints);

// export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
//   return new Zodios(baseUrl, endpoints, options);
// }

import { User } from "@prisma/client";

export type WsUserType = Omit<User, 'password'>;
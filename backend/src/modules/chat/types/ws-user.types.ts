import { User } from "generated/prisma/client";

export type WsUserType = Omit<User, 'password'>;
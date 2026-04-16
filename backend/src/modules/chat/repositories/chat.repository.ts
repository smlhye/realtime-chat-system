import { Injectable } from "@nestjs/common";
import { Chat, Prisma } from "generated/prisma/client";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class ChatRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.ChatCreateInput): Promise<Chat> {
        return this.prisma.chat.create({ data });
    }

    async findPrivateChatBetweenUsers(userA: string, userB: string): Promise<Chat | null> {
        return this.prisma.chat.findFirst({
            where: {
                isGroup: false,
                AND: [
                    { users: { some: { userId: userA } } },
                    { users: { some: { userId: userB } } },
                ],
            },
        });
    }

    async findByChatIdAndUserId(chatId: string, userId: string) {
        return this.prisma.chat.findUnique({
            where: {
                id: chatId,
                users: {
                    some: { userId: userId },
                }
            }
        })
    }

    async findUserChats(userId: string): Promise<Chat[]> {
        return this.prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        })
    }
}
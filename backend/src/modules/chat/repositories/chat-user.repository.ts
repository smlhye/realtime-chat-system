import { Injectable } from "@nestjs/common";
import { ChatUser, Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class ChatUserRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.ChatUserCreateInput): Promise<ChatUser> {
        return this.prisma.chatUser.create({ data });
    }

    async createMany(userIds: string[], chatId: string): Promise<ChatUser[]> {
        const now = new Date();

        await this.prisma.chatUser.createMany({
            data: userIds.map(userId => ({
                chatId,
                userId,
                lastSeenAt: now,
            })),
            skipDuplicates: true,
        });

        return this.prisma.chatUser.findMany({
            where: {
                chatId,
                userId: { in: userIds },
            },
        });
    }

    async update(id: string, data: Prisma.ChatUserUpdateInput): Promise<ChatUser | null> {
        return this.prisma.chatUser.update({
            where: { id },
            data,
        })
    }

    async findByChatIdAndUserId(chatId: string, userId: string): Promise<ChatUser | null> {
        return this.prisma.chatUser.findUnique({
            where: {
                chatId_userId: {
                    chatId,
                    userId,
                }
            }
        })
    }

    async findById(id: string): Promise<ChatUser | null> {
        return this.prisma.chatUser.findUnique({
            where: { id },
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.chatUser.delete({
            where: { id },
        })
    }
}
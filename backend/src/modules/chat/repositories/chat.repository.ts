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

    async findChatsOfUser({ userId, name, take = 20, cursor }: { userId: string, name?: string, take?: number, cursor?: string }): Promise<
        (Chat & {
            users: {
                user: {
                    fullName: string
                }
            }[]
        })[]> {
        const cursorDate = cursor ? new Date(cursor) : undefined;
        return this.prisma.chat.findMany({
            where: {
                users: {
                    some: {
                        userId
                    }
                },
                // messages: {
                //     some: {}
                // },
                ...(name && {
                    OR: [
                        {
                            isGroup: true,
                            name: {
                                contains: name,
                                mode: 'insensitive',
                            },
                        },
                        {
                            isGroup: false,
                            users: {
                                some: {
                                    NOT: { userId },
                                    user: {
                                        fullName: {
                                            contains: name,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                            },
                        },
                    ]
                }),
                ...(cursorDate && {
                    updatedAt: {
                        lt: cursorDate,
                    },
                }),
            },
            orderBy: [
                { updatedAt: 'desc' },
                { id: 'asc' },
            ],
            take,
            select: {
                id: true,
                name: true,
                isGroup: true,
                createdAt: true,
                updatedAt: true,
                users: {
                    where: {
                        NOT: { userId },
                    },
                    take: 1,
                    select: {
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
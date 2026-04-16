import { Injectable } from "@nestjs/common";
import { Message, Prisma } from "generated/prisma/client";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class MessageRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.MessageCreateInput): Promise<Message> {
        return this.prisma.message.create({ data });
    }

    async update(id: string, data: Prisma.MessageUpdateInput): Promise<Message | null> {
        return this.prisma.message.update({
            where: { id },
            data,
        })
    }

    async findById(id: string): Promise<Message | null> {
        return this.prisma.message.findUnique({
            where: {
                id
            }
        })
    }

    async findByTempId(tempId: string): Promise<Message | null> {
        return this.prisma.message.findUnique({
            where: {
                tempId
            }
        })
    }

    async findMessages({ chatId, take = 20, cursor, after }: { chatId: string, take?: number, cursor?: string, after?: string }): Promise<(
        Message & {
            sender: {
                fullName: string
            }
        }
    )[]> {
        const where: any = { chatId };
        if (after) {
            where.createdAt = { gt: new Date(after) };
        }

        if (cursor) {
            where.createdAt = {
                ...(where.createdAt || {}),
                lt: new Date(cursor),
            };
        }
        return this.prisma.message.findMany({
            where,
            orderBy: {
                createdAt: after ? 'asc' : 'desc',
                id: 'asc',
            },
            include: {
                sender: {
                    select: {
                        fullName: true,
                    },
                },
            },
            take,
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.message.delete({ where: { id } });
    }
}
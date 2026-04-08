import { Injectable } from "@nestjs/common";
import { Message, Prisma } from "@prisma/client";
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

    async delete(id: string): Promise<void> {
        await this.prisma.message.delete({ where: { id } });
    }
}
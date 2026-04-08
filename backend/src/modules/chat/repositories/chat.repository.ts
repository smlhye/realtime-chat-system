import { Injectable } from "@nestjs/common";
import { Chat, Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class ChatRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.ChatCreateInput): Promise<Chat> {
        return this.prisma.chat.create({ data });
    }
}
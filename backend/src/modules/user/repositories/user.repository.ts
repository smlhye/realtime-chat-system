import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class UserRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
        return this.prisma.user.create({
            data
        })
    }

    async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
        return this.prisma.user.findUnique({
            where: { email },
        })
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { username },
        })
    }

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }
}
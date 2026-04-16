import { Injectable } from "@nestjs/common";
import { Prisma, User } from "generated/prisma/client";
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

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: {
                id,
            }, data,
        })
    }
}
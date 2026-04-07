import { Injectable } from "@nestjs/common";
import { Prisma, Session } from "@prisma/client";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class SessionRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.SessionCreateInput) {
        return this.prisma.session.create({
            data
        });
    }

    async findById(id: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { id },
        });
    }

    async findByToken(token: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { token },
        });
    }

    async findByDeviceAndIpActive(device: string, ip: string): Promise<Session | null> {
        return this.prisma.session.findFirst({
            where: {
                device,
                ip,
                isActive: true,
            }
        })
    }

    async revokedToken(id: string): Promise<void> {
        await this.prisma.session.update({
            where: { id },
            data: { isActive: false, revokedAt: new Date(), }
        })
    }

    async cleanToken(): Promise<number> {
        const now = new Date();
        const result = await this.prisma.session.deleteMany({
            where: {
                OR: [
                    { isActive: false, },
                    { expiresAt: { lt: now } },
                    { revokedAt: { lt: now } },
                ]
            }
        });
        return result.count;
    }
}
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor!: ReturnType<typeof createAdapter>;

    constructor(app: INestApplicationContext) {
        super(app);
    }

    async connectToRedis(options: {
        host?: string;
        port?: number;
        password?: string;
        db?: number;
    }) {
        const pubClient = new Redis(options);
        const subClient = pubClient.duplicate();

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: any) {
        if (!this.adapterConstructor) {
            throw new Error('Redis adapter not initialized. Call connectToRedis() first.');
        }
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
import { AppLoggerService } from '../../logger/logger.service';
import { Prisma } from '@prisma/client';

export const createPrismaExtension = (logger: AppLoggerService) => ({
    name: 'performance-extension',
    query: {
        async $allOperations({
            model,
            operation,
            args,
            query,
        }: {
            model?: string;
            operation: string;
            args: unknown;
            query: (args: unknown) => Prisma.PrismaPromise<unknown>;
        }) {
            const start = performance.now();
            try {
                const result = await query(args);
                const duration = performance.now() - start;
                if (duration > 100) {
                    logger.warn(
                        `[SLOW QUERY] ${model ?? 'unknown'}.${operation} - ${duration.toFixed(2)}ms`,
                        'Prisma',
                    );
                }
                return result;
            } catch (error) {
                const err = error as Error;
                logger.error(
                    `[DB ERROR] ${model ?? 'unknown'}.${operation}`,
                    err.stack,
                    'Prisma',
                );
                throw error;
            }
        },
    },
});
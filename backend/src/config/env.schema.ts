import { z } from "zod";

export const envSchema = z.object({
    APP_NAME: z.string().default("realtime-chat"),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']),

    DB_TYPE: z.literal('mysql'),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number().default(3306),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_SYNC: z.coerce.boolean().default(false),
    DB_LOGGING: z.coerce.boolean().default(false),

    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().default(0),
    REDIS_TTL: z.coerce.number().default(3600),

    JWT_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    JWT_ISSUER: z.string().default("realtime-chat"),
    JWT_AUDIENCE: z.string().default("users"),

    SOCKET_PORT: z.coerce.number().default(3001),
    SOCKET_CORS_ORIGIN: z.string().default("*"),
    SOCKET_TRANSPORTS: z.string().default("websocket,polling"),
    SOCKET_PING_TIMEOUT: z.coerce.number().default(60000),
    SOCKET_PING_INTERVAL: z.coerce.number().default(25000),

    CLIENT_URL: z.string().url(),
    CORS_ORIGIN: z.string().default("*"),
    CORS_METHODS: z.string().default("GET,HEAD,PUT,PATCH,POST,DELETE"),
    CORS_CREDENTIALS: z.coerce.boolean().default(true),

    UPLOAD_DIR: z.string().default("./uploads"),
    MAX_FILE_SIZE: z.coerce.number().default(10485760),
    ALLOWED_FILE_TYPES: z.string().default("image/jpeg,image/png"),

    BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
    RATE_LIMIT_TTL: z.coerce.number().default(60),
    RATE_LIMIT_LIMIT: z.coerce.number().default(100),

    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),

    TYPEORM_AUTO_LOAD_ENTITIES: z.coerce.boolean().default(true),
    TYPEORM_MIGRATIONS_RUN: z.coerce.boolean().default(false),

    ENABLE_CHAT: z.coerce.boolean().default(true),
    ENABLE_GROUP_CHAT: z.coerce.boolean().default(true),
    ENABLE_FILE_UPLOAD: z.coerce.boolean().default(true),
    ENABLE_ONLINE_STATUS: z.coerce.boolean().default(true),
})

export type EnvType = z.infer<typeof envSchema>;
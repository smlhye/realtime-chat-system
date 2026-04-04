import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) { }

    get App() {
        return {
            name: this.configService.get<string>('APP_NAME'),
            port: this.configService.get<number>('PORT'),
            isProd: this.configService.get<string>('NODE_ENV') === 'production',
        };
    }

    get database() {
        return {
            type: this.configService.get<'mysql'>('DB_TYPE'),
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            synchronize: this.configService.get<boolean>('DB_SYNC'),
            logging: this.configService.get<boolean>('DB_LOGGING'),
        };
    }

    get redis() {
        return {
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            db: this.configService.get<number>('REDIS_DB'),
            ttl: this.configService.get<number>('REDIS_TTL'),
        };
    }

    get jwt() {
        return {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
            refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
            issuer: this.configService.get<string>('JWT_ISSUER'),
            audience: this.configService.get<string>('JWT_AUDIENCE'),
        };
    }

    get socket() {
        return {
            port: this.configService.get<number>('SOCKET_PORT'),
            corsOrigin: this.configService.get<string>('SOCKET_CORS_ORIGIN'),
            transports: this.configService.get<string>('SOCKET_TRANSPORTS')!.split(','),
            pingTimeout: this.configService.get<number>('SOCKET_PING_TIMEOUT'),
            pingInterval: this.configService.get<number>('SOCKET_PING_INTERVAL'),
        };
    }

    get cors() {
        return {
            origin: this.configService.get<string>('CORS_ORIGIN'),
            methods: this.configService.get<string>('CORS_METHODS'),
            credentials: this.configService.get<boolean>('CORS_CREDENTIALS'),
        };
    }

    get upload() {
        return {
            dir: this.configService.get<string>('UPLOAD_DIR'),
            maxFileSize: this.configService.get<number>('MAX_FILE_SIZE'),
            allowedTypes: (this.configService.get<string>('ALLOWED_FILE_TYPES') ?? '').split(','),
        };
    }

    get security() {
        return {
            saltRounds: this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
            rateLimitTtl: this.configService.get<number>('RATE_LIMIT_TTL'),
            rateLimitLimit: this.configService.get<number>('RATE_LIMIT_LIMIT'),
        };
    }

    get features() {
        return {
            chat: this.configService.get<boolean>('ENABLE_CHAT'),
            groupChat: this.configService.get<boolean>('ENABLE_GROUP_CHAT'),
            fileUpload: this.configService.get<boolean>('ENABLE_FILE_UPLOAD'),
            onlineStatus: this.configService.get<boolean>('ENABLE_ONLINE_STATUS'),
        };
    }

    get clientUrl() {
        return this.configService.get<string>('CLIENT_URL');
    }
}
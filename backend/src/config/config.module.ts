import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { envSchema } from './env.schema';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (config) => {
                const parsed = envSchema.safeParse(config);
                if (!parsed.success) {
                    console.error('Invalid ENV config\n');
                    parsed.error.issues.forEach((err) =>
                        console.error(`** ${err.path.join('.')}: ${err.message}`),
                    );
                    process.exit(1);
                }
                return parsed.data;
            },
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule { }
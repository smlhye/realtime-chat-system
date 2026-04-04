import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppLoggerService } from "./infrastructure/logger/logger.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(AppLoggerService);
    app.useLogger(logger);
    app.listen(3000);
}

bootstrap();
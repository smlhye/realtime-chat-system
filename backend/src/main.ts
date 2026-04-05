import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppLoggerService } from "./infrastructure/logger/logger.service";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(AppLoggerService);

    app.useLogger(logger);

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    app.listen(3000);
}

bootstrap();
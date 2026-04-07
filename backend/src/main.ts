import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppLoggerService } from "./infrastructure/logger/logger.service";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import * as YAML from 'yamljs';
import { SwaggerModule } from "@nestjs/swagger";
import { AppConfigService } from "./config/config.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = app.get(AppLoggerService);
    const conf = app.get(AppConfigService);

    app.setGlobalPrefix('api/v1');

    const document = YAML.load('./openapi/openapi.yaml')
    SwaggerModule.setup('api/v1/docs', app, document);

    app.useLogger(logger);

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    const PORT = conf.app.port;
    app.listen(PORT || 3000);
    logger.log(`Server running on http://localhost:${PORT}/api/v1`, 'NestApplication');
    logger.log(`Swagger docs available on http://localhost:${PORT}/api/v1/docs`, 'NestApplication');
}

bootstrap();
import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./infrastructure/queue/workers/worker.module";

async function bootstrap() {
    await NestFactory.createApplicationContext(WorkerModule);
    console.log('Worker is running...');
}

bootstrap();
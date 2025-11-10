import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import './app/trace/tracing'; // IMPORTANTE: importar ANTES de tudo

import { LoggerService } from './app/trace/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  await app.listen(3000);
  logger.log('Aplicação iniciada na porta 3000');
}

bootstrap();

import { AppModule } from './app/app.module';
import './app/trace/tracing'; // IMPORTANTE: importar AQUI
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { ConfigService } from '@nestjs/config';

import { LoggerService } from './app/trace/logger.service';
import { AppValidationPipe } from './app/pipes/app-validation.pipe';
import { EnvironmentVariables } from './app/env.validations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: configService.get('MONGO_DB_URI'),
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: configService.get('NODE_ENV') === 'PRODUCTION',
        sameSite: 'lax',
      },
    }),
  );

  app.useGlobalPipes(
    new AppValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  const frontendUrl = configService.get('FRONTEND_URL');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  await app.listen(3000);
  logger.log('Aplicação iniciada na porta 3000');
}

bootstrap();

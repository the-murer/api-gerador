import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { EmailModule } from '../email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate, type EnvironmentVariables } from './env.validations';
import { ActionTokensModule } from '@app/action-tokens/action-tokens.module';
import { LoggingInterceptor } from './trace/loggin.interceptor';
import { LoggerService } from './trace/logger.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from '@app/tasks/tasks.module';
import { AiModule } from '@app/ai/ai.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        uri: configService.get('MONGO_DB_URI', { infer: true }),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    TasksModule,
    AiModule,
    ActionTokensModule,
    AuthModule,
    EmailModule,
    WorkspacesModule,
    /* MODULES_INJECTOR */
  ],
  controllers: [AppController],
  providers: [
    LoggerService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { EmailModule } from '../email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate, type EnvironmentVariables } from './env.validations';
import { ActionTokensModule } from '@app/action-tokens/action-tokens.module';

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
    UsersModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule { }

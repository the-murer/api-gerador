import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { UsersRepository } from '@app/users/users.repository';
import { User, UserSchema } from '@app/users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SignInHandler } from './handlers/sing-in.handler';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@app/app/env.validations';
import { ForgotPasswordHandler } from './handlers/forgot-password.handler';
import { RecoverPasswordHandler } from './handlers/recover-password.handler';
import { ActionTokensService } from '@app/action-tokens/action-tokens.service';
import { ActionTokensModule } from '@app/action-tokens/action-tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ActionTokensModule,
  ],
  controllers: [AuthController],
  providers: [
    ActionTokensService,
    UsersRepository,
    SignInHandler,
    ForgotPasswordHandler,
    RecoverPasswordHandler,
  ],
})
export class AuthModule {}

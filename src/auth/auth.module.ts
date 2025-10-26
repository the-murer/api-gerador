import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { UsersRepository } from '@app/users/users.repository';
import { User, UserSchema } from '@app/users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SignInHandler } from './handlers/sing-in.handler';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@app/app/env.validations';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: "7d" },
        global: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    SignInHandler
  ]
})
export class AuthModule { }

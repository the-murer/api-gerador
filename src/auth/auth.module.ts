import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@app/users/users.module';
import { UsersRepository } from '@app/users/users.repository';
import { User, UserSchema } from '@app/users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SignInHandler } from './handlers/sing-in.handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // ENV
    JwtModule.register({
      global: true,
      secret: "meia noite eu te conto",
      signOptions: { expiresIn: '7d' },
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

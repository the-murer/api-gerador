import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '@app/users/users.module';
import { UsersRepository } from '@app/users/users.repository';
import { User, UserSchema } from '@app/users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SignInHandler } from './handlers/sign-in.handler';
import { ForgotPasswordHandler } from './handlers/forgot-password.handler';
import { RecoverPasswordHandler } from './handlers/recover-password.handler';
import { WhoAmIHandler } from './handlers/who-am-i.handler';
import { ChangeWorkspaceHandler } from './handlers/change-workspace.handler';
import { ActionTokensService } from '@app/action-tokens/action-tokens.service';
import { ActionTokensModule } from '@app/action-tokens/action-tokens.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { FilesModule } from '@app/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    ActionTokensModule,
    FilesModule,
  ],
  controllers: [AuthController],
  providers: [
    RolesGuard,
    { provide: APP_GUARD, useClass: RolesGuard },
    ActionTokensService,
    UsersRepository,
    SignInHandler,
    ForgotPasswordHandler,
    RecoverPasswordHandler,
    WhoAmIHandler,
    ChangeWorkspaceHandler,
  ],
  exports: [RolesGuard],
})
export class AuthModule {}

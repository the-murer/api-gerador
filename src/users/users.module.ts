import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserHandler } from './handlers/create-user.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersRepository } from './users.repository';
import { FindUserByIdHandler } from './handlers/find-user-by-id.handler';
import { EmailService } from '@app/email/email.service';
import { EmailModule } from '@app/email/email.module';
import { ActionTokensModule } from '@app/action-tokens/action-tokens.module';
import { ActionTokensService } from '@app/action-tokens/action-tokes.service';

@Module({
  imports: [
    EmailModule,
    ActionTokensModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    CreateUserHandler,
    FindUserByIdHandler,
    EmailService,
    ActionTokensService,
  ],
  exports: [UsersRepository]
})
export class UsersModule { }

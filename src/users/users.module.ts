import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserHandler } from './handlers/create-user.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersRepository } from './users.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersRepository, CreateUserHandler],
  exports: [UsersRepository]
})
export class UsersModule { }

import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';

type CreateUserHandlerInput = {
  name: string;
  email: string
}

type CreateUserHandlerOutput = any

@Injectable()
export class CreateUserHandler implements CommandHandler<CreateUserHandlerInput, CreateUserHandlerOutput> {

  constructor(
    @Inject(UsersRepository) 
    private readonly usersRepository: UsersRepository,
  ) { }

  public async execute(input: CreateUserHandlerInput) {

    // const user = this.usersRepository.create({
    //   name: input.name,
    //   email: input.email,
    // })

    return {
      name: input.name
    }
  }
}

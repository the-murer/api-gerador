import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { User } from '../users.schema';

type FindUserByIdHandlerInput = {
  name: string;
  email: string
}

type FindUserByIdHandlerOutput = User

@Injectable()
export class FindUserByIdHandler implements CommandHandler<FindUserByIdHandlerInput, FindUserByIdHandlerOutput> {

  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) { }

  public async execute(input: FindUserByIdHandlerInput) {
    const user = this.usersRepository.create({
      name: input.name,
      email: input.email,
    })

    if (!user) {
      throw new NotFoundException("Usuario nao encontrado")
    }

    return user
  }
}

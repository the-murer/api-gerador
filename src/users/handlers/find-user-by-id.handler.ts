import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { User } from '../users.schema';
import { FindUserByIdDto } from '../dto/find-user-by-id.dto';

interface FindUserByIdHandlerInput extends FindUserByIdDto {}

type FindUserByIdHandlerOutput = User

@Injectable()
export class FindUserByIdHandler implements CommandHandler<FindUserByIdHandlerInput, FindUserByIdHandlerOutput> {

  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) { }

  public async execute({ id }: FindUserByIdHandlerInput) {
    const user = this.usersRepository.findById(id)

    if (!user) {
      throw new NotFoundException("Usuario nao encontrado")
    }

    return user as unknown as User
  }
}

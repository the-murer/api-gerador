import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../users.schema';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';

interface ChangeUserActiveHandlerInput extends UniqueIdDto {
  active: boolean
}

type ChangeUserActiveHandlerOutput = User;

@Injectable()
export class ChangeUserActiveHandler
  implements CommandHandler<ChangeUserActiveHandlerInput, ChangeUserActiveHandlerOutput>
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute({ id, active }: ChangeUserActiveHandlerInput) {
    const user = await this.usersRepository.updateById(id, { active });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }
}

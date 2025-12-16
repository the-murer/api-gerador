import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../users.schema';

interface UpdateUserHandlerInput extends Partial<CreateUserDto> {
  id: string
}

type UpdateUserHandlerOutput = User;

@Injectable()
export class UpdateUserHandler
  implements CommandHandler<UpdateUserHandlerInput, UpdateUserHandlerOutput>
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute({ id, ...input }: UpdateUserHandlerInput) {
    const user = await this.usersRepository.updateById(id, input);

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }
}

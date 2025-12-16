import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { User } from '../users.schema';
import { FindUsersDto } from '../dto/find-users.dto';
import { DefaultPaginationResponse } from '@app/app/dtos/default-pagination.dto';

interface FindUsersHandlerInput extends FindUsersDto {}

type FindUsersHandlerOutput = DefaultPaginationResponse<User>;

@Injectable()
export class FindUsersHandler
  implements CommandHandler<FindUsersHandlerInput, FindUsersHandlerOutput>
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute({ page, limit }: FindUsersHandlerInput) {
    const { items, metadata } = await this.usersRepository.findPaginated(
      page,
      limit,
    );

    return {
      metadata,
      items,
    };
  }
}

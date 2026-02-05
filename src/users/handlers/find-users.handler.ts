import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { User } from '../users.schema';
import { FindUsersDto } from '../dto/find-users.dto';
import { DefaultPaginationResponse } from '@app/app/dtos/default-pagination.dto';
import { StorageService } from '@app/files/storage.service';
import { buildFilter } from '@app/utils/database/base.repository';

interface FindUsersHandlerInput extends FindUsersDto {}

type FindUsersHandlerOutput = DefaultPaginationResponse<User>;

@Injectable()
export class FindUsersHandler
  implements CommandHandler<FindUsersHandlerInput, FindUsersHandlerOutput>
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(StorageService)
    private readonly storageService: StorageService,
  ) {}

  public async execute({
    page,
    limit,
    sort = 'createdAt',
    sortOrder,
    name,
    email,
  }: FindUsersHandlerInput) {
    const { items, metadata } = await this.usersRepository.findPaginated(
      page,
      limit,
      sort,
      sortOrder,
      buildFilter({ name, email }),
    );

    for (const user of items) {
      if (user?.profilePictureUrl) {
        const tempProfileUrl = await this.storageService.getFileUrl(
          user?.profilePictureUrl,
        );
        user.profilePictureUrl = tempProfileUrl;
      }
    }

    return {
      metadata,
      items,
    };
  }
}

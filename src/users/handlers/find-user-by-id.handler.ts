import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { User } from '../users.schema';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { FilesRepository } from '@app/files/files.repository';
import { StorageService } from '@app/files/storage.service';

interface FindUserByIdHandlerInput extends UniqueIdDto {}

type FindUserByIdHandlerOutput = User;

@Injectable()
export class FindUserByIdHandler
  implements CommandHandler<FindUserByIdHandlerInput, FindUserByIdHandlerOutput>
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(FilesRepository)
    private readonly filesRepository: FilesRepository,
    @Inject(StorageService)
    private readonly storageService: StorageService,
  ) {}

  public async execute({ id }: FindUserByIdHandlerInput) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    
    if (user?.profilePictureUrl) {
      const tempProfileUrl = await this.storageService.getFileUrl(user?.profilePictureUrl);
      user.profilePictureUrl = tempProfileUrl;
    }

    return user;
  }
}

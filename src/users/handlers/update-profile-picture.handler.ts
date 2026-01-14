import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { User } from '../users.schema';
import { FilesRepository } from '@app/files/files.repository';
import { generateId } from '@app/utils/database/schema-utils';
import { UpdateProfilePictureDto } from '../dto/update-profile-picture.dto';

interface UpdateProfilePictureHandlerInput extends UpdateProfilePictureDto {}

type UpdateProfilePictureHandlerOutput = User;

@Injectable()
export class UpdateProfilePictureHandler
  implements
    CommandHandler<
      UpdateProfilePictureHandlerInput,
      UpdateProfilePictureHandlerOutput
    >
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(FilesRepository)
    private readonly filesRepository: FilesRepository,
  ) {}

  public async execute({ id, fileId }: UpdateProfilePictureHandlerInput) {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new NotFoundException('Usuario nao encontrado');

    if (user.profilePictureUrl) {
      await this.filesRepository.deleteFile(user.profilePictureUrl);
    }

    await this.filesRepository.confirmFileUpload(fileId);

    await this.usersRepository.updateById(id, {
      profilePictureId: generateId(fileId),
    });

    return user;
  }
}

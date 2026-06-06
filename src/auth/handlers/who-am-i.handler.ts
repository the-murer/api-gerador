import { SessionUser } from '@app/auth/session.types';
import { StorageService } from '@app/files/storage.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

type WhoAmIHandlerInput = {
  userId: string;
  workspaceId?: string;
};

type WhoAmIHandlerOutput = SessionUser;

@Injectable()
export class WhoAmIHandler implements CommandHandler<
  WhoAmIHandlerInput,
  WhoAmIHandlerOutput
> {
  private readonly logger = new Logger(WhoAmIHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private storageService: StorageService,
  ) {}

  async execute({ userId, workspaceId }: WhoAmIHandlerInput) {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const workspaces = user.workspaces;
    const [defaultWorkspace] = workspaces;

    if (!defaultWorkspace) {
      this.logger.error(`User ${user._id} has no workspace associated`);
      throw new UnauthorizedException('Usuário sem workspace associado');
    }

    if (user.profilePictureUrl) {
      user.profilePictureUrl = await this.storageService.getFileUrl(
        user.profilePictureUrl,
        60 * 60 * 24,
      );
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      workspaceId: workspaceId || defaultWorkspace.workspaceId,
      workspaces,
      role: defaultWorkspace.role,
    };
  }
}

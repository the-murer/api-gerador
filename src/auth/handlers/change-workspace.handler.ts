import { SessionUser } from '@app/auth/session.types';
import { StorageService } from '@app/files/storage.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

type ChangeWorkspaceHandlerInput = {
  userId: string;
  workspaceId: string;
};

type ChangeWorkspaceHandlerOutput = SessionUser;

@Injectable()
export class ChangeWorkspaceHandler implements CommandHandler<
  ChangeWorkspaceHandlerInput,
  ChangeWorkspaceHandlerOutput
> {
  constructor(
    private usersRepository: UsersRepository,
    private storageService: StorageService,
  ) {}

  async execute({ userId, workspaceId }: ChangeWorkspaceHandlerInput) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.profilePictureUrl) {
      user.profilePictureUrl = await this.storageService.getFileUrl(
        user.profilePictureUrl,
        60 * 60 * 24,
      );
    }

    const currentWorkspace = user.workspaces.find(
      (workspace) => workspace.workspaceId.toString() === workspaceId,
    );
    console.log("🚀 ~ ChangeWorkspaceHandler ~ execute ~ currentWorkspace:", currentWorkspace)

    if (!currentWorkspace) {
      throw new NotFoundException('Workspace não encontrado para o usuário');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      workspaceId: currentWorkspace.workspaceId,
      workspaces: user.workspaces,
      role: currentWorkspace.role,
    };
  }
}

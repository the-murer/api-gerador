import { SessionUser } from '@app/auth/session.types';
import { StorageService } from '@app/files/storage.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

type SignInHandlerInput = {
  email: string;
  pass: string;
};

type SignInHandlerOutput = SessionUser;

@Injectable()
export class SignInHandler
  implements CommandHandler<SignInHandlerInput, SignInHandlerOutput>
{
  private readonly logger = new Logger(SignInHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private storageService: StorageService,
  ) {}

  async execute({ email, pass }: SignInHandlerInput) {
    const user = (await this.usersRepository.findOne({ email }));
    const isValid = await bcrypt.compare(pass, (user?.password || ""));

    if (!isValid || !user) {
      this.logger.error('Falha ao autenticar');
      throw new UnauthorizedException();
    }

    if (user.profilePictureUrl) {
      user.profilePictureUrl = await this.storageService.getFileUrl(
        user.profilePictureUrl,
        60 * 60 * 24 * 6,
      );
    }

    const [defaultWorkspace] = user.workspaces;

    return {
      _id: user._id.toString(),
      name: user.name,
      email,
      profilePictureUrl: user.profilePictureUrl,
      workspaceId: defaultWorkspace?.workspaceId,
      workspaces: user.workspaces,
      role: defaultWorkspace.role,
    };
  }
}

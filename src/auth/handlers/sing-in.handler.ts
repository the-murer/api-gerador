import { StorageService } from '@app/files/storage.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

type SignInHandlerInput = {
  email: string;
  pass: string;
};

type SignInHandlerOutput = any;

@Injectable()
export class SignInHandler
  implements CommandHandler<SignInHandlerInput, SignInHandlerOutput>
{
  private readonly logger = new Logger(SignInHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private storageService: StorageService,
  ) {}

  async execute({ email, pass }: SignInHandlerInput) {
    const user = (await this.usersRepository.findOne({ email })) as any;
    // const isValid = await bcrypt.compare(pass, user.password);
    // console.log("🚀 ~ SignInHandler ~ execute ~ isValid:", isValid)

    // if (!isValid) {
    //   this.logger.error('Falha ao autenticar');
    //   throw new UnauthorizedException();
    // }

    if (user.profilePictureUrl) {
      user.profilePictureUrl = await this.storageService.getFileUrl(
        user.profilePictureUrl,
        1000 * 60 * 60 * 24 * 6.9,
      );
    }

    const payload = {
      sub: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email,
      profilePictureUrl: user.profilePictureUrl,
      roles: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

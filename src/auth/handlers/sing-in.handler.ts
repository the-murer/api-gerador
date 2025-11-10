
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type SignInHandlerInput = {
  email: string,
  pass: string
}

type SignInHandlerOutput = any

@Injectable()
export class SignInHandler implements CommandHandler<SignInHandlerInput, SignInHandlerOutput> {
  private readonly logger = new Logger(SignInHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) { }

  async execute({ email, pass }: SignInHandlerInput) {
    const user = await this.usersRepository.findOne({ email });

    
    if (user?.password !== pass) {
      this.logger.error("Falha ao autenticar")
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id.toString(), _id: user._id.toString(), name: user.name, email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}

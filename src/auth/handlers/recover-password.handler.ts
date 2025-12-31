import { ActionTokenType } from '@app/action-tokens/action-tokens.schema';
import { ActionTokensService } from '@app/action-tokens/action-tokens.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

type RecoverPasswordHandlerInput = {
  hash: string;
  password: string;
};

type RecoverPasswordHandlerOutput = any;

@Injectable()
export class RecoverPasswordHandler
  implements
    CommandHandler<RecoverPasswordHandlerInput, RecoverPasswordHandlerOutput>
{
  private readonly logger = new Logger(RecoverPasswordHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private actionTokensService: ActionTokensService,
  ) {}

  async execute({ hash, password }: RecoverPasswordHandlerInput) {
    const actionToken =
      await this.actionTokensService.findActionTokenByHash(hash);

    if (!actionToken) {
      throw new NotFoundException('Token não encontrado');
    }

    await this.actionTokensService.validateAndDeleteActionToken(
      hash,
      actionToken.entityId,
      ActionTokenType.ChangePassword,
    );

    const user = await this.usersRepository.findById(actionToken.entityId);

    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.usersRepository.updateById(actionToken.entityId, {
      password: passwordHash,
    });

    return {
      success: true,
      message: 'Senha recuperada com sucesso',
    };
  }
}

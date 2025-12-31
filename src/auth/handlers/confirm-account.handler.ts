import { ActionTokenType } from '@app/action-tokens/action-tokens.schema';
import { ActionTokensService } from '@app/action-tokens/action-tokens.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';

type ConfirmAccountHandlerInput = {
  hash: string;
  name: string;
  password: string;
};

type ConfirmAccountHandlerOutput = any;

@Injectable()
export class ConfirmAccountHandler
  implements
    CommandHandler<ConfirmAccountHandlerInput, ConfirmAccountHandlerOutput>
{
  private readonly logger = new Logger(ConfirmAccountHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private actionTokensService: ActionTokensService,
  ) {}

  async execute({ hash, name, password }: ConfirmAccountHandlerInput) {
    const actionToken =
      await this.actionTokensService.findActionTokenByHash(hash);

    if (!actionToken) {
      throw new NotFoundException('Token não encontrado');
    }

    await this.actionTokensService.validateAndDeleteActionToken(
      hash,
      actionToken.entityId,
      ActionTokenType.CreateAccount,
    );

    const user = await this.usersRepository.findById(actionToken.entityId);

    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.usersRepository.updateById(actionToken.entityId, {
      active: true,
      name,
      password: passwordHash,
    });

    return {
      success: true,
    };
  }
}

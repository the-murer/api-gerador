import { ActionTokenType } from '@app/action-tokens/action-tokens.schema';
import { ActionTokensService } from '@app/action-tokens/action-tokens.service';
import { UsersRepository } from '@app/users/users.repository';
import { CommandHandler } from '@app/utils/command-handler';
import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

type ForgotPasswordHandlerInput = {
  email: string;
};

type ForgotPasswordHandlerOutput = any;

@Injectable()
export class ForgotPasswordHandler
  implements
    CommandHandler<ForgotPasswordHandlerInput, ForgotPasswordHandlerOutput>
{
  private readonly logger = new Logger(ForgotPasswordHandler.name);

  constructor(
    private usersRepository: UsersRepository,
    private actionTokensService: ActionTokensService,
  ) {}

  async execute({ email }: ForgotPasswordHandlerInput) {
    const user = (await this.usersRepository.findOne({ email })) as any;

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    const actionToken = await this.actionTokensService.createActionToken({
      entityId: user._id.toString(),
      type: ActionTokenType.ChangePassword,
    });

    return {
      success: true,
    };
  }
}

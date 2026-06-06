import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../users.schema';
import { EmailService } from '@app/email/email.service';
import { ActionTokensService } from '@app/action-tokens/action-tokens.service';
import { ActionTokenType } from '@app/action-tokens/action-tokens.schema';
import { WorkspacesRepository } from '@app/workspaces/workspaces.repository';

interface CreateUserHandlerInput extends CreateUserDto {}

type CreateUserHandlerOutput = User;

@Injectable()
export class CreateUserHandler
  implements CommandHandler<CreateUserHandlerInput, CreateUserHandlerOutput>
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(WorkspacesRepository)
    private readonly workspaceRepository: WorkspacesRepository,
    @Inject(ActionTokensService)
    private readonly actionTokensService: ActionTokensService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  public async execute(input: CreateUserHandlerInput) {
    const workspace = await this.workspaceRepository.findById(
      input.workspaceId,
    );
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const user = await this.usersRepository.create({
      name: input.name,
      email: input.email,
      workspaces: [
        {
          workspaceId: workspace._id.toString(),
          workspaceName: workspace.name,
          role: input.role,
        },
      ],
    });

    const actionToken = await this.actionTokensService.createActionToken({
      entityId: input.email,
      type: ActionTokenType.CreateAccount,
    });

    await this.emailService.sendMail(
      input.email,
      `Olá ${input.name} Voce foi convidado para usar o sistema`,
      'Cara entra ai nosso sistema é massa',
      `<b>Clica aqui e cadastre uma senha ${actionToken.hash} </b>`,
    );

    return user;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../users.schema';
import { EmailService } from '@app/email/email.service';
import { ActionTokensRepository } from '@app/action-tokens/action-tokens.repository';
import { ActionTokensService } from '@app/action-tokens/action-tokes.service';
import { ActionTokenType } from '@app/action-tokens/action-tokens.schema';

interface CreateUserHandlerInput extends CreateUserDto { }

type CreateUserHandlerOutput = User

@Injectable()
export class CreateUserHandler implements CommandHandler<CreateUserHandlerInput, CreateUserHandlerOutput> {

  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(ActionTokensService)
    private readonly actionTokensService: ActionTokensService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) { }

  public async execute(input: CreateUserHandlerInput) {
    const user = this.usersRepository.create({
      name: input.name,
      email: input.email,
    })

    const actionToken = await this.actionTokensService.createActionToken({
      entityId: input.email,
      type: ActionTokenType.CreateAccount,
    })

    await this.emailService.sendMail(
      input.email,
      `Olá ${input.name} Voce foi convidado para usar o sistema`,
      'Cara entra ai nosso sistema é massa',
      `<b>Clica aqui e cadastre uma senha ${actionToken.hash} </b>`
    );

    return user
  }
}

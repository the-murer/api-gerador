import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ChatsRepository } from '../repositories/chat.repository';
import { Chat } from '../schemas/chat.schema';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { Message } from '../schemas/message.schema';
import { MessagesRepository } from '../repositories/message.repository';

interface FindChatByIdHandlerInput extends UniqueIdDto { }

type FindChatByIdHandlerOutput = {
  chat: Chat
  messages: Message[];
};

@Injectable()
export class FindChatByIdHandler
  implements CommandHandler<FindChatByIdHandlerInput, FindChatByIdHandlerOutput> {
  constructor(
    @Inject(ChatsRepository)
    private readonly chatsRepository: ChatsRepository,
    @Inject(MessagesRepository)
    private readonly messagesRepository: MessagesRepository,
  ) { }

  public async execute({
    id,
  }: FindChatByIdHandlerInput) {
    const chat = await this.chatsRepository.findById(id);
    const messages = await this.messagesRepository.findByChatId(id);

    if (!chat) {
      throw new NotFoundException('Chat nao encontrado');
    }

    return {
      chat,
      messages,
    };
  }
}

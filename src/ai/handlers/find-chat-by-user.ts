import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ChatsRepository } from '../chats/chat.repository';
import { Chat } from '../chats/chat.schema';
import { DefaultPaginationResponse } from '@app/app/dtos/default-pagination.dto';
import { FindChatsByUserDto } from '../dto/find-chats-by-user.dto';

interface FindChatsByUserHandlerInput extends FindChatsByUserDto { }

type FindChatsByUserHandlerOutput = DefaultPaginationResponse<Chat>;

@Injectable()
export class FindChatsByUserHandler
  implements CommandHandler<FindChatsByUserHandlerInput, FindChatsByUserHandlerOutput> {
  constructor(
    @Inject(ChatsRepository)
    private readonly chatsRepository: ChatsRepository,
  ) { }

  public async execute({
    page,
    limit,
    sort = 'createdAt',
    sortOrder,
  }: FindChatsByUserHandlerInput) {
    const { items, metadata } = await this.chatsRepository.findPaginated(
      page,
      limit,
      sort,
      sortOrder,
    );


    return {
      metadata,
      items,
    };
  }
}

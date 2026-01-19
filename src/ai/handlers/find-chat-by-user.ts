import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ChatsRepository } from '../repositories/chat.repository';
import { Chat } from '../schemas/chat.schema';
import { DefaultPaginationResponse } from '@app/app/dtos/default-pagination.dto';
import { FindChatsByUserDto } from '../dto/find-chats-by-user.dto';
import { generateId } from '@app/utils/database/schema-utils';

interface FindChatsByUserHandlerInput extends FindChatsByUserDto {
  userId: string;
}

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
    userId,
  }: FindChatsByUserHandlerInput) {
    const { items, metadata } = await this.chatsRepository.findPaginated(
      page,
      limit,
      sort,
      sortOrder,
      { userId: generateId(userId) },
    );


    return {
      metadata,
      items,
    };
  }
}

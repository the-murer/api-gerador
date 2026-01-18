import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';
import { Chat } from './chat.schema';
import { generateId } from '@app/utils/database/schema-utils';

@Injectable()
export class ChatsRepository extends BaseRepository<Chat> {
  constructor(@InjectModel(Chat.name) model: Model<Chat>) {
    super(model);
  }

  async findChatsByUserId(userId: string): Promise<Chat[]> {
    return this.model.find({ userId: generateId(userId) });
  }

}

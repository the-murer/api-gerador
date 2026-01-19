import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';
import { Message } from '../schemas/message.schema';
import { generateId } from '@app/utils/database/schema-utils';

@Injectable()
export class MessagesRepository extends BaseRepository<Message> {
  constructor(@InjectModel(Message.name) model: Model<Message>) {
    super(model);
  }

  async saveMessage(message: Message): Promise<Message> {
    return this.model.create(message);
  }

  async editMessage(message: Message): Promise<Message | null> {
    const updatedMessage = await this.model.findOneAndUpdate(
      { _id: message._id }, { $set: { content: message.content } }, { new: true });

    return updatedMessage;
  }

  async findByChatId(chatId: string): Promise<Message[]> {
    return this.model.find({ chatId: generateId(chatId) });
  }
}

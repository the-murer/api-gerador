import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ChatsRepository } from '../repositories/chat.repository';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { Message, MessageRole } from '../schemas/message.schema';
import { MessagesRepository } from '../repositories/message.repository';
import { AiService } from '../services/ai.service';
import { User } from '@app/users/users.schema';
import { SendMessageDto } from '../dto/send-message.dto';
import { Chat } from '../schemas/chat.schema';
import { generateId } from '@app/utils/database/schema-utils';

interface GenerateAiResponseHandlerInput extends SendMessageDto {
  user: User;
}

type GenerateAiResponseHandlerOutput = Message;

@Injectable()
export class GenerateAiResponseHandler
  implements
    CommandHandler<
      GenerateAiResponseHandlerInput,
      GenerateAiResponseHandlerOutput
    >
{
  constructor(
    @Inject(ChatsRepository)
    private readonly chatsRepository: ChatsRepository,
    @Inject(MessagesRepository)
    private readonly messagesRepository: MessagesRepository,
    @Inject(AiService)
    private readonly aiService: AiService,
  ) {}

  public async execute({
    chatId,
    content,
    user,
  }: GenerateAiResponseHandlerInput) {
    let chat: Chat;
    let messages: Message[] = [];

    if (!chatId) {
      chat = await this.createChat(content, user._id.toString());
    } else {
      chat = (await this.chatsRepository.findById(chatId)) as Chat;
      messages = await this.messagesRepository.findByChatId(chatId);

      if (!chat) {
        throw new NotFoundException('Chat nao encontrado');
      }
    }

    const message = await this.aiService.generateResponse({
      messages,
      chat,
      user,
      content,
    });

    await this.messagesRepository.saveMessage({
      _id: generateId(),
      content,
      role: MessageRole.USER,
      chatId: chat._id,
    });

    return message;
  }

  private async createChat(content: string, userId: string): Promise<Chat> {
    const chatTitle = await this.aiService.generateConversationTitle(content);

    const chat = await this.chatsRepository.create({
      title: chatTitle,
      userId: generateId(userId),
    });

    return chat;
  }
}

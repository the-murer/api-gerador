import { Injectable } from '@nestjs/common';
import { parseMessages, SYSTEM_PROMPT, TITLE_PROMPT } from '../constants';
import { Message, MessageRole } from '../schemas/message.schema';
import { experimental_transcribe, generateText } from 'ai';
import { Chat } from '../schemas/chat.schema';
import { User } from '@app/users/users.schema';
import { MessagesRepository } from '../repositories/message.repository';
import { generateId } from '@app/utils/database/schema-utils';
import { openai } from '@ai-sdk/openai';

type StreamResponseConfig = {
  messages: Message[];
  chat: Chat;
  user: User;
  content: string;
};

@Injectable()
export class AiService {
  constructor(private readonly messageRepository: MessagesRepository) {}

  public async generateResponse({
    messages,
    chat,
    content,
  }: StreamResponseConfig): Promise<Message> {
    const formattedMessages = parseMessages(messages, content);

    const result = await generateText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: 0.05,
    });

    const message = await this.messageRepository.saveMessage({
      _id: generateId(),
      content: result.text.trim(),
      role: MessageRole.ASSISTANT,
      chatId: chat._id,
    });

    return message;
  }

  public async generateConversationTitle(content: string): Promise<string> {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: TITLE_PROMPT,
      messages: [{ role: MessageRole.USER, content }],
    });

    return result.text.trim();
  }

  public async transcribeAudio(audio: Buffer): Promise<string> {
    const result = await experimental_transcribe({
      model: openai.transcription('whisper-1'),
      audio,
    });

    return result.text;
  }
}

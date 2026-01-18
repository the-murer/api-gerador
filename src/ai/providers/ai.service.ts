import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SYSTEM_PROMPT } from './constants';
import { Message } from '../messages/message.schema';
import { streamText } from 'ai';
import { Chat } from '../chats/chat.schema';
import { User } from '@app/users/users.schema';

type StreamResponseConfig = {
  messages: Message[];
  chat: Chat;
  user: User;
}

@Injectable()
export class AiService {
  constructor(private readonly messageRepository: MessageRepository) { }


  async proccesMessage(message: string) {
    const result = streamText(
      await this.buildMessageStream(messages, message, authenticatedUser),
    );
  }

  public async streamResponse({ messages, chat }: StreamResponseConfig) {
    const streamConfig = {
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      tools: await this.getTools(authenticatedUser),
      temperature: 0.05,
      // stopWhen: stepCountIs(5),
      // onFinish: async ({ response, toolCalls }) => {
      //   const lastTool = toolCalls?.[toolCalls.length - 1];

      //   if (lastTool?.result?.metadata) {
      //     const { page, pageCount, total } = lastTool.result.metadata;
      //     response.text = `Página ${page} de ${pageCount} • ${total} resultados`;
      //   }
      // },
    }


    const result = streamText(
      streamConfig,
    );

    const assistantTextPromise = result.text.catch((error) => {
      console.error('Erro ao obter texto gerado no streaming:', error);
      return '';
    });

    result.pipeUIMessageStreamToResponse(res, {
      messageMetadata: () => ({
        chatId: chat._id.toString(),
        chatTitle: chat.title,
      }),
    });

    const assistantText = (await assistantTextPromise).trim();

    const parts = this.mapAISDKMessagesToParts(
      (await result.response).messages,
    );

    await this.messageRepository.saveMessage(
      assistantText,
      'assistant',
      conversation._id,
      parts,
    );
  }

}













return;







const assistantTextPromise = result.text.catch((error) => {
  console.error('Erro ao obter texto gerado no streaming:', error);
  return '';
});

result.pipeUIMessageStreamToResponse(res, {
  messageMetadata: () => ({
    conversationId: conversation._id,
    conversationTitle: conversation.title,
  }),
});

const assistantText = (await assistantTextPromise).trim();

const parts = this.mapAISDKMessagesToParts(
  (await result.response).messages,
);

await this.aiRepository.saveMessage(
  assistantText,
  'assistant',
  conversation._id,
  parts,
);
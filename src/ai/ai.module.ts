import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiController } from './ai.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Document, DocumentSchema } from './schemas/document.schema';
import { FindChatsByUserHandler } from './handlers/find-chat-by-user';
import { FindChatByIdHandler } from './handlers/find-chat-by-id';
import { GenerateAiResponseHandler } from './handlers/generate-ai-response';
import { AddDocumentHandler } from './handlers/add-document-handler';
import { TranscribeAudioHandler } from './handlers/transcribe-audio.handler';
import { AiService } from './services/ai.service';
import { IngestDocumentService } from './services/internal-services/ingest-document.service';
import { ChatsRepository } from './repositories/chat.repository';
import { MessagesRepository } from './repositories/message.repository';
import { DocumentsRepository } from './repositories/document.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [AiController],
  providers: [
    ChatsRepository,
    MessagesRepository,
    DocumentsRepository,
    FindChatsByUserHandler,
    FindChatByIdHandler,
    GenerateAiResponseHandler,
    AddDocumentHandler,
    TranscribeAudioHandler,
    AiService,
    IngestDocumentService
  ],
  exports: [],
})
export class AiModule { }

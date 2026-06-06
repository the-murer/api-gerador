import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { AiService } from '@app/ai/services/ai.service';

@Module({
  controllers: [MessagingController],
  providers: [MessagingService, AiService],
})
export class MessagingModule {}

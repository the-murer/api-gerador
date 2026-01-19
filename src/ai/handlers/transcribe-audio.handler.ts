import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { AiService } from '../services/ai.service';

interface TranscribeAudioHandlerInput {
  audio: Buffer;
}

type TranscribeAudioHandlerOutput = { message: string };

@Injectable()
export class TranscribeAudioHandler
  implements CommandHandler<TranscribeAudioHandlerInput, TranscribeAudioHandlerOutput> {
  constructor(
    @Inject(AiService)
    private readonly aiService: AiService,
  ) { }

  public async execute({
    audio,
  }: TranscribeAudioHandlerInput) {
    const message = await this.aiService.transcribeAudio(audio);

    return { message };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FindChatsByUserHandler } from './handlers/find-chat-by-user';
import { FindChatsByUserDto } from './dto/find-chats-by-user.dto';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { FindChatByIdHandler } from './handlers/find-chat-by-id';
import { GenerateAiResponseHandler } from './handlers/generate-ai-response';
import { SendMessageDto } from './dto/send-message.dto';
import { AuthUser } from '@app/utils/user-decorator';
import { User } from '@app/users/users.schema';
import { AddDocumentDto } from './dto/add-document.dto';
import { AddDocumentHandler } from './handlers/add-document-handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscribeAudioHandler } from './handlers/transcribe-audio.handler';

@Controller('ai')
export class AiController {
  constructor(
    private readonly findChatsByUserHandler: FindChatsByUserHandler,
    private readonly findChatByIdHandler: FindChatByIdHandler,
    private readonly generateAiResponseHandler: GenerateAiResponseHandler,
    private readonly addDocumentHandler: AddDocumentHandler,
    private readonly transcribeAudioHandler: TranscribeAudioHandler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('chats')
  async findChatsByUser(
    @Query() findDto: FindChatsByUserDto,
    @AuthUser() user: User,
  ) {
    const result = await this.findChatsByUserHandler.execute({
      ...findDto,
      userId: user._id.toString(),
    });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get('chats/:id')
  async findChatById(@Param() { id }: UniqueIdDto) {
    const result = await this.findChatByIdHandler.execute({ id });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('message')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @AuthUser() user: User,
  ) {
    const result = await this.generateAiResponseHandler.execute({
      ...sendMessageDto,
      user,
    });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('document')
  async addDocument(
    @Body() addDocumentDto: AddDocumentDto,
    @AuthUser() user: User,
  ) {
    const result = await this.addDocumentHandler.execute({
      ...addDocumentDto,
      ownerId: user._id.toString(),
    });

    return result;
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribeAudio(@UploadedFile() audioFIle: any) {
    if (!audioFIle) {
      throw new Error('Nenhum arquivo de áudio foi enviado');
    }

    const audio = audioFIle.buffer;

    const message = await this.transcribeAudioHandler.execute({
      audio,
    });

    return { message };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from '@app/utils/public.decorator';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @HttpCode(HttpStatus.OK)
  @Post('receive')
  @Public()
  async receiveMessage(@Body() message: any) {
    console.log(
      '🚀 ~ MessagingController ~ sendMessage ~ sendMessageDto:',
      message,
    );

    const response = await this.messagingService.messageReceiver(message);
    console.log(
      '🚀 ~ MessagingController ~ callbackMessage ~ response:',
      response,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('send')
  @Public()
  async sendMessage(@Body() message: any) {
    console.log(
      '🚀 ~ MessagingController ~ sendMessage ~ sendMessageDto:',
      message,
    );
    return this.messagingService.sendMessage(message.to, message.body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('callback')
  @Public()
  async callbackMessage(@Body() message: any) {
    console.log(
      '🚀 ~ MessagingController ~ sendMessage ~ sendMessageDto:',
      message,
    );
  }
}

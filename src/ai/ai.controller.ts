import { Roles } from '@app/auth/roles/decorator';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FindChatsByUserHandler } from './handlers/find-chat-by-user';
import { FindChatsByUserDto } from './dto/find-chats-by-user.dto';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { FindChatByIdHandler } from './handlers/find-chat-by-id';

@Controller('ai')
export class AiController {
  constructor(
    private readonly findChatsByUserHandler: FindChatsByUserHandler,
    private readonly findChatByIdHandler: FindChatByIdHandler,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('chats')
  @Roles({ action: 'read', subject: 'User' })
  async findChatsByUser(@Query() findDto: FindChatsByUserDto) {
    const result = await this.findChatsByUserHandler.execute(findDto);

    return result;
  }


  @HttpCode(HttpStatus.OK)
  @Get('chats/:id')
  @Roles({ action: 'read', subject: 'User' })
  async findChatById(@Param() { id }: UniqueIdDto) {
    const result = await this.findChatByIdHandler.execute({ id });

    return result;
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('chats/:id/messages')
  // @Roles({ action: 'create', subject: 'User' })
  // async createMessage(@Param() { id }: UniqueIdDto, @Body() createMessageDto: CreateMessageDto) {
  //   const result = await this.createMessageHandler.execute({ id, ...createMessageDto });

  //   return result;
  // }
}

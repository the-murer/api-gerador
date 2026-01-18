import { DefaultPaginationDto } from '@app/app/dtos/default-pagination.dto';
import { Chat } from '../chats/chat.schema';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class FindChatsByUserDto extends DefaultPaginationDto<Chat> {

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}

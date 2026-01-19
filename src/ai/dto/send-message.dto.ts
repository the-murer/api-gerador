import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  chatId?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
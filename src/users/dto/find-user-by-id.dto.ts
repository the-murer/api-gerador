import { IsString } from 'class-validator';

export class FindUserByIdDto {
  @IsString()
  id: string;
}

import { IsString } from 'class-validator';

export class UniqueIdDto {
  @IsString()
  id: string;
}

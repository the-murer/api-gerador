import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { IsBoolean } from 'class-validator';

export class ChangeUserActiveDto extends UniqueIdDto {
  @IsBoolean()
  active: boolean;
}

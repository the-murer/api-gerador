import { DefaultPaginationDto } from '@app/app/dtos/default-pagination.dto';
import { User } from '../users.schema';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindUsersDto extends DefaultPaginationDto<User> {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

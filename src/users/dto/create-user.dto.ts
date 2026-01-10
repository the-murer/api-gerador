import { IsArray, IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../users.schema';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];
}

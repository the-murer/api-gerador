import { IsEnum, IsString } from 'class-validator';
import { UserRoles } from '../users.schema';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsEnum(UserRoles)
  role: UserRoles;

  @IsString()
  workspaceId: string;
}

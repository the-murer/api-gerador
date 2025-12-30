import { IsArray, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}

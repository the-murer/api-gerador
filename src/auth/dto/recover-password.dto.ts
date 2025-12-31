import { IsEmail, IsString } from 'class-validator';

export class RecoverPasswordDto {
  @IsString()
  password: string;
}

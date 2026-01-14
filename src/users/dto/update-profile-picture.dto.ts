import { IsString } from 'class-validator';

export class UpdateProfilePictureDto {
  @IsString()
  id: string;

  @IsString()
  fileId: string;
}

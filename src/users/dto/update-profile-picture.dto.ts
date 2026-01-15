import { IsString } from 'class-validator';

export class UpdateProfilePictureDto {
  @IsString()
  id: string;

  @IsString()
  fileKey: string;
}

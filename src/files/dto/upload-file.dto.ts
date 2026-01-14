import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileType } from '../files.schema';

export class UploadFileDto {
  @IsEnum(FileType)
  fileType: FileType;

  @IsString()
  @IsOptional()
  extension?: string;
  
  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;
}

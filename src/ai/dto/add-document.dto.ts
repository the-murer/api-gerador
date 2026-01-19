import { IsNotEmpty, IsString } from "class-validator";

export class AddDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsString()
  @IsNotEmpty()
  fileUrl: string;
}
import {
  Body,
  Controller,
  BadRequestException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileHandler } from './handlers/upload-file.handler';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly uploadHandler: UploadFileHandler) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  async upload(@Body() uploadDto: UploadFileDto, @UploadedFiles() files: any) {
    const fileData = files?.file?.[0];
    const file = fileData?.buffer;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const extension =
      uploadDto.extension ||
      fileData.originalname?.split('.').pop() ||
      '.bin';
    const mimeType = uploadDto.mimeType || fileData.mimetype || 'application/octet-stream';

    const result = await this.uploadHandler.execute({
      ...uploadDto,
      extension,
      mimeType,
      file,
    });

    return result;
  }
}

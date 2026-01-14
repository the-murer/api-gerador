import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { FilesRepository } from '../files.repository';
import { Files, FileStatus, FileType } from '../files.schema';
import { StorageService } from '../storage.service';
import { UploadFileDto } from '../dto/upload-file.dto';

interface UploadFileHandlerInput extends UploadFileDto {
  file: Buffer;
}

type UploadFileHandlerOutput = Files;

@Injectable()
export class UploadFileHandler
  implements CommandHandler<UploadFileHandlerInput, UploadFileHandlerOutput>
{
  constructor(
    @Inject(FilesRepository)
    private readonly filesRepository: FilesRepository,
    @Inject(StorageService)
    private readonly storageService: StorageService,
  ) {}

  public async execute({
    file,
    fileType = FileType.IMAGE,
    extension,
    mimeType,
    fileSize,
  }: UploadFileHandlerInput) {
    const key = await this.storageService.uploadFile(
      file,
      extension || '.bin',
      mimeType || 'application/octet-stream',
    );

    const createdFile = await this.filesRepository.create({
      key,
      fileType,
      mimeType: mimeType || 'application/octet-stream',
      extension: extension || '.bin',
      bucket: this.storageService.getBucket(),
      status: FileStatus.PENDING,
      fileSize,
    });

    return createdFile;
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FilesRepository } from '@app/files/files.repository';
import { StorageService } from '@app/files/storage.service';
import { Types } from 'mongoose';

@Injectable()
export class CleanFilesService {
  private readonly logger = new Logger(CleanFilesService.name);

  constructor(
    @Inject(FilesRepository)
    private readonly filesRepository: FilesRepository,
    @Inject(StorageService)
    private readonly storageService: StorageService,
  ) {}

  @Cron('0 * * * *')
  async handle() {
    this.logger.log('Deleting excluded files');
    const deleted = await this.filesRepository.findDeletedFiles();

    const deletedFiles: Types.ObjectId[] = [];
    for (const file of deleted) {
      try {
        await this.storageService.deleteFile(file.key);
        deletedFiles.push(file._id);
      } catch (error) {
        this.logger.error(`Error deleting file ${file.key}: ${error}`);
      }
    }

    await this.filesRepository.deleteDeletedFiles(deletedFiles);

    this.logger.log(`${deletedFiles.length} excluded files deleted`);
  }
}

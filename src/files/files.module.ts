import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileHandler } from './handlers/upload-file.handler';
import { Files, FileSchema } from './files.schema';
import { FilesController } from './files.controller';
import { FilesRepository } from './files.repository';
import { StorageService } from './storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Files.name, schema: FileSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesRepository, UploadFileHandler, StorageService],
  exports: [FilesRepository, StorageService],
})
export class FilesModule {}

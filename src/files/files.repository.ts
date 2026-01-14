import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Files, FileStatus } from './files.schema';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';
import { generateId } from '@app/utils/database/schema-utils';

@Injectable()
export class FilesRepository extends BaseRepository<Files> {
  constructor(@InjectModel(Files.name) model: Model<Files>) {
    super(model);
  }

  async confirmFileUpload(fileId: string): Promise<Files> {
    const file = await this.model.findOneAndUpdate(
      { _id: generateId(fileId) },
      { $set: { status: FileStatus.COMPLETED } },
      { new: true },
    );

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async deleteFile(url: string): Promise<null> {
    await this.model.updateOne({ key: url }, { status: FileStatus.DELETED });

    return null;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Files, FileStatus } from './files.schema';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';

@Injectable()
export class FilesRepository extends BaseRepository<Files> {
  constructor(@InjectModel(Files.name) model: Model<Files>) {
    super(model);
  }

  async confirmFileUpload(key: string): Promise<Files> {
    const file = await this.model.findOneAndUpdate(
      { key },
      { $set: { status: FileStatus.COMPLETED } },
      { new: true },
    );

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async deleteFile(key: string): Promise<null> {
    await this.model.updateOne({ key }, { status: FileStatus.DELETED });

    return null;
  }

  async findDeletedFiles(): Promise<Files[]> {
    const filesToDelete = await this.model.find({
      status: { $ne: FileStatus.COMPLETED },
      updatedAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 1) },
    });

    return filesToDelete;
  }
  async deleteDeletedFiles(files: Types.ObjectId[]): Promise<void> {
    await this.model.deleteMany({
      _id: { $in: files },
    });
  }
}

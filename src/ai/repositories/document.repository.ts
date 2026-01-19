import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';
import { Document } from '../schemas/document.schema';

@Injectable()
export class DocumentsRepository extends BaseRepository<Document> {
  constructor(@InjectModel(Document.name) model: Model<Document>) {
    super(model);
  }

}

import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@app/utils/database/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './workspace.schema';
import { Model } from 'mongoose';

@Injectable()
export class WorkspacesRepository extends BaseRepository<Workspace> {
  constructor(@InjectModel(Workspace.name) model: Model<Workspace>) {
    super(model);
  }
}

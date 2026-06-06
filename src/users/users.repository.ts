import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';
import {
  DefaultPaginationResponse,
  SortOrder,
} from '@app/app/dtos/default-pagination.dto';
import { generateId } from '@app/utils/database/schema-utils';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }

  async findPaginatedWithWorkspace(
    page: number,
    limit: number,
    sort: keyof User,
    workspaceId: string,
    sortOrder?: SortOrder,
    baseFilter?: FilterQuery<User>,
  ): Promise<DefaultPaginationResponse<User>> {
    const skip = (page - 1) * limit;

    const sortQuery = { [sort]: sortOrder === SortOrder.ASC ? 1 : -1 };

    const filter = {
      ...baseFilter,
      workspaces: { $elemMatch: { workspaceId: generateId(workspaceId) } },
    };
    const [total, data] = await Promise.all([
      this.model.countDocuments(filter || {}),
      this.model
        .find(filter || {})
        .sort(sortQuery as Record<keyof User | string, 1 | -1>)
        .skip(skip)
        .limit(limit),
    ]);

    return {
      items: data,
      metadata: { total },
    };
  }
}

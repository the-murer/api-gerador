import {
  DefaultPaginationResponse,
  SortOrder,
} from '@app/app/dtos/default-pagination.dto';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { generateId } from './schema-utils';

type SortQuery<T> = Record<keyof T | string, 1 | -1>;

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const created = (await this.model.create(data)).toJSON();
    return created as T;
  }

  async update(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
  ): Promise<T | null> {
    const updated = await this.model
      .findOneAndUpdate(filter, data, { new: true })
      .lean();
    return updated as T;
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    const updated = await this.model
      .findOneAndUpdate({ _id: generateId(id) }, data, { new: true })
      .lean();
    return updated as T;
  }

  async delete(id: string): Promise<T | null> {
    const deleted = await this.model
      .findOneAndDelete({ _id: generateId(id) })
      .lean();

    return deleted as T;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter?: FilterQuery<T>): Promise<T[] | null> {
    const response = await this.model.find(filter || {}).lean();

    return response as T[];
  }

  async findById(_id: string): Promise<T | null> {
    return this.model.findById(_id);
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: keyof T,
    sortOrder?: SortOrder,
    filter?: FilterQuery<T>,
  ): Promise<DefaultPaginationResponse<T>> {
    const skip = (page - 1) * limit;

    const sortQuery = { [sort]: sortOrder === SortOrder.ASC ? 1 : -1 };

    const [total, data] = await Promise.all([
      this.model.countDocuments(filter || {}),
      this.model
        .find(filter || {})
        .sort(sortQuery as SortQuery<T>)
        .skip(skip)
        .limit(limit),
    ]);

    return {
      items: data,
      metadata: { total },
    };
  }
}

export const buildFilter = (
  filters: Record<string, string | number | boolean | undefined>,
): FilterQuery<any> => {
  const filter: FilterQuery<any> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'string') {
      filter[key] = { $regex: value, $options: 'i' };
    }
    if (typeof value === 'number') {
      filter[key] = { $eq: value };
    }
    if (typeof value === 'boolean') {
      filter[key] = value;
    }
  }

  console.log("🚀 ~ buildFilter ~ filter:", filter)
  return filter;
};

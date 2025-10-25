import { Model, FilterQuery, UpdateQuery } from 'mongoose';

type SortQuery<T> = Record<keyof T | string, 1 | -1>

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) { }

  async create(data: Partial<T>): Promise<T> {
    const created = (await this.model.create(data)).toJSON();
    return created as T;
  }

  async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, { new: true });
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter?: FilterQuery<T>): Promise<T[] | null> {
    const response = await this.model.find(filter || {}).lean();

    return response as T[]
  }

  async findById(_id: string): Promise<T | null> {
    return this.model.findById(_id);
  }

  async findPaginated(
    page: number,
    limit: number,
    filter?: FilterQuery<T>,
    sort?: SortQuery<T>): Promise<{
      items: T[], total: number
    }> {
    const skip = (page - 1) * limit

    const [total, data] = await Promise.all([
      this.model.countDocuments(filter || {}),
      this.model.find(filter || {})
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ])

    return {
      items: data,
      total,
    }
  }
}

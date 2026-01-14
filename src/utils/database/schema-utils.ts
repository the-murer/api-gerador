
import { Types } from 'mongoose';

export abstract class BaseSchema {
  _id: Types.ObjectId;
}

export abstract class TimestampSchema extends BaseSchema {
  createdAt?: Date;
  updatedAt?: Date;
}


export const generateId = (id?: string) => new Types.ObjectId(id);

import { Types } from 'mongoose';

export abstract class BaseSchema {
  _id: Types.ObjectId;
}

export abstract class TimestampedSchema extends BaseSchema {
  createdAt?: Date;
  updatedAt?: Date;
}

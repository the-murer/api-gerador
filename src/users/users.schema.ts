import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User extends TimestampSchema {
  @Prop({ default: null, type: Boolean })
  active: boolean | null;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: UserRoles, type: [String] })
  roles: UserRoles[];

  @Prop()
  password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

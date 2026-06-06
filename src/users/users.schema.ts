import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export class UserWorkspace {
  @Prop({ required: true })
  workspaceId: string;

  @Prop({ required: true })
  workspaceName: string;

  @Prop({ required: true })
  role: UserRoles;
}

@Schema({ timestamps: true })
export class User extends TimestampSchema {
  @Prop({ default: null, type: Boolean })
  active: boolean | null;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  profilePictureUrl?: string;

  @Prop({ required: true, type: [UserWorkspace] })
  workspaces: UserWorkspace[];

  @Prop()
  password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

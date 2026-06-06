import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Workspace extends TimestampSchema {
  @Prop({ default: null, type: Boolean })
  active: boolean | null;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  profilePictureUrl?: string;
}

export type WorkspaceDocument = HydratedDocument<Workspace>;
export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

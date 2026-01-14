import { User } from '@app/users/users.schema';
import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum FileType {
  IMAGE = 'pdf',
  PDF = 'application/pdf',
  VIDEO = 'video/mp4',
  ANY = '*/*',
}

export enum FileStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  DELETED = 'deleted',
}

@Schema({ timestamps: true })
export class Files extends TimestampSchema {
  @Prop({ required: true, enum: FileType, type: String })
  fileType: FileType;

  @Prop({ required: true })
  status: FileStatus;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  bucket: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  ownerId?: Types.ObjectId;

  @Prop({ required: false })
  fileSize?: number;
}

export type FilesDocument = HydratedDocument<Files>;
export const FileSchema = SchemaFactory.createForClass(Files);

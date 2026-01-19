import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Document extends TimestampSchema {

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  ownerId?: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  uploadDate: Date;

  @Prop({ required: false, type: [String], default: [] })
  tags: string[];


  @Prop({ required: false, type: Object, default: {} })
  metadata: Object;
}

export type DocumentDocument = HydratedDocument<Document>;
export const DocumentSchema = SchemaFactory.createForClass(Document);

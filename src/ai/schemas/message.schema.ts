
import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Schema({ timestamps: true })
export class Message extends TimestampSchema {
  @Prop({ required: true })
  role: MessageRole;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false, type: [String], default: [] })
  versions?: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Chat' })
  chatId: Types.ObjectId;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);

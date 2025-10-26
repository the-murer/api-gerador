
import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ActionTokenType {
  CreateAccount = "createAccount",
  ChangePassword = "changePassword"
}

@Schema({ timestamps: true })
export class ActionToken extends TimestampSchema {
  @Prop({ required: true, })
  type: ActionTokenType;

  @Prop({ required: true, unique: true })
  hash: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export type ActionTokenDocument = HydratedDocument<ActionToken>;
export const ActionTokenSchema = SchemaFactory.createForClass(ActionToken);

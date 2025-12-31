import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionToken, ActionTokenSchema } from './action-tokens.schema';
import { ActionTokensRepository } from './action-tokens.repository';
import { ActionTokensService } from './action-tokens.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActionToken.name, schema: ActionTokenSchema }])
  ],
  providers:[ActionTokensRepository, ActionTokensService], 
  exports: [ActionTokensRepository, ActionTokensService]
})
export class ActionTokensModule {}

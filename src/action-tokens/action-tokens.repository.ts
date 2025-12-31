import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';
import { ActionToken } from './action-tokens.schema';

@Injectable()
export class ActionTokensRepository extends BaseRepository<ActionToken> {
  constructor(@InjectModel(ActionToken.name) model: Model<ActionToken>) {
    super(model);
  }

  public async deleteActionTokenByHash(hash: string) {
    const deleteToken = await this.model.deleteOne({ hash });

    if (deleteToken.deletedCount < 1) {
      throw new ForbiddenException('Falha ao deletar toke');
    }

    return true;
  }

  public async findActionTokenByHash(hash: string) {
    const actionToken = await this.model.findOne({
      hash,
      expiresAt: { $gt: new Date() },
    });
    return actionToken;
  }
}

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ActionTokenType } from './action-tokens.schema';
import { ActionTokensRepository } from './action-tokens.repository';
import { randomBytes } from 'crypto';

type CreateActionTokenType = {
  entityId: string,
  type: ActionTokenType,
  expiration?: "30m" | "3d" | "7d"
}

@Injectable()
export class ActionTokensService {
  constructor(
    private readonly actionTokenRepository: ActionTokensRepository
  ) { }

  public async createActionToken({ expiration, ...rest }: CreateActionTokenType) {
    const expiresAt = this.getExpirationDate(expiration ?? "30m")
    const hash = randomBytes(32).toString('hex');

    const actionToken = await this.actionTokenRepository.create({
      ...rest,
      hash,
      expiresAt
    })

    return actionToken
  }

  public async validateAndDeleteActionToken(hash: string, entityId: string) {
    const actionToken = await this.actionTokenRepository.findOne({ hash, entityId })

    if (!actionToken) {
      throw new NotFoundException("Token não encontrado")
    }

    if (actionToken.expiresAt < new Date()) {
      throw new ForbiddenException("Expirado")
    }

    await this.actionTokenRepository.deleteActionTokenByHash(hash)

    return actionToken
  }

  private getExpirationDate(expiration: '30m' | '3d' | '7d') {
    const now = Date.now()
    const map = {
      '30m': 1000 * 60 * 30,
      '3d': 1000 * 60 * 60 * 24 * 3,
      '7d': 1000 * 60 * 60 * 24 * 7,
    } as const

    return new Date(now + map[expiration])
  }

}

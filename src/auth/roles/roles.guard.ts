import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { defineAbility } from './roles.factory'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const handlerRules = this.reflector.get('roles', ctx.getHandler())
    if (!handlerRules) return true

    const req = ctx.switchToHttp().getRequest()
    const ability = defineAbility(req.user)

    return handlerRules.every((rule) =>
      ability.can(rule.action, rule.subject),
    )
  }
}

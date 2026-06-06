import { IS_PUBLIC_KEY } from '@app/utils/public.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RolesGuard } from '@app/auth/roles/roles.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesGuard: RolesGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.session?.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    request['user'] = user;

    const hasRoles = await this.rolesGuard.canActivate(context);
    if (!hasRoles) {
      return false;
    }

    return true;
  }
}

import { SetMetadata } from '@nestjs/common'

export const Roles = (...rules: { action: string; subject: string }[]) =>
  SetMetadata('roles', rules)

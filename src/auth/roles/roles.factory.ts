import { User, UserRoles } from '@app/users/users.schema';
import {
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  PureAbility,
} from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'User' | /* SUBJECT_INJECTOR */ 'all';

export type AppAbility = PureAbility<any>;

export function defineAbility(user: User): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

  const includeRole = (role: UserRoles) => {
    return user.workspaces.some((workspace) => workspace.role === role);
  };

  if (includeRole(UserRoles.ADMIN)) {
    can('manage', 'all');
  }
  if (includeRole(UserRoles.USER)) {
    can('read', 'all');
  }

  return build({
    detectSubjectType: (item) =>
      item.constructor as ExtractSubjectType<Subjects>,
  });
}

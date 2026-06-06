import { UserRoles, UserWorkspace } from '@app/users/users.schema';

export type SessionUser = {
  _id: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  workspaceId: string;
  workspaces: UserWorkspace[];
  role: UserRoles;
};

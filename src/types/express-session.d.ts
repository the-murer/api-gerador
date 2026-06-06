import { SessionUser } from '@app/auth/session.types';

declare module 'express-session' {
  interface SessionData {
    user: SessionUser;
  }
}

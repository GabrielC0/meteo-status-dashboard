export type SessionUser = {
  id?: string;
  email?: string;
  role?: string;
  name?: string | null;
};

export type SessionWithUser = {
  user?: SessionUser;
};

export const hasUser = (
  session: object | null | undefined,
): session is Required<Pick<SessionWithUser, 'user'>> => {
  if (!session) return false;
  const s = session as SessionWithUser;
  return !!s.user;
};

export const isAdminSession = (session: object | null | undefined) => {
  if (!session) return false;
  const s = session as SessionWithUser;
  return !!s.user && s.user.role === 'admin';
};

export type User = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  id: number;
  email: string;
  role: 'admin' | 'user';
};

export type DbUser = User & {
  password: string;
};

export type CreateUserData = {
  email: string;
  password: string;
  role: 'admin' | 'user';
};

export type UpdateUserData = {
  email: string;
  password?: string;
  role: 'admin' | 'user';
};

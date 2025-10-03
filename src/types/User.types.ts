export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateUserData = {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
};

export type UpdateUserData = {
  email?: string;
  password?: string;
  name?: string;
  role?: 'admin' | 'user';
  is_active?: boolean;
};

export type SafeUser = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
};

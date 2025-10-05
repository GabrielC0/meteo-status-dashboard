import type { User } from './User.types';

export type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string;
};

export type PortalUserInfoProps = {
  user: User | null;
  isLoading?: boolean;
  onLogout: () => void;
};

export type AdminUserInfoProps = {
  user: User | null;
  isLoading?: boolean;
  onLogout: () => void;
};

export type UserRole = 'user' | 'admin';

export type NewUserForm = {
  email: string;
  password: string;
  role: UserRole;
};

export type EditingUser = {
  id: number;
  email: string;
  role: UserRole;
};

export type UserListItem = {
  id: number;
  email: string;
  role: UserRole;
};

export type UserInfoProps = {
  user: User | null;
  isLoading?: boolean;
  onLogout: () => void;
};

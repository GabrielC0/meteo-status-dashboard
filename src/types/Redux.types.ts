import type { MarketMenu } from '@/types/AppStorage.types';
export type LoginState = {
  isLoggedIn: boolean;
  sessionToken: string | null;
  webSocketPath: string | null;
  user: SessionUser | null;
  userAuthorizations: Record<string, boolean> | null;
  userGroups: Array<{ value: string; description: string }>;
  timeoutLength: number;
  loginTime: number;
  titanDate: number;
  universes: Array<{ id: number; name: string; color: string }>;
  marketMenu: MarketMenu | null;
  calculationHypotheses: string[];
  selectedHypothesis: string;
};

export type SessionUser = {
  id: number;
  email: string;
  role: 'user' | 'admin';
};

export type RootState = {
  login: LoginState;
};

'use client';

import { SessionProvider } from 'next-auth/react';
import type { LayoutProps } from '@/types/Layout.types';

export const SessionProviderWrapper = ({ children }: LayoutProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

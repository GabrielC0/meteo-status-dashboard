'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type UserRole = 'admin' | 'user';

type UseAuthOptions = {
  redirectTo?: string;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
};

export const useAuth = (options: UseAuthOptions = {}) => {
  const { redirectTo = '/login', allowedRoles = ['admin', 'user'], requireAuth = true } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!requireAuth) return;

    if (status === 'unauthenticated') {
      router.push(redirectTo);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      const userRole = ('role' in session.user ? session.user.role : null) as UserRole | null;

      if (!userRole || !allowedRoles.includes(userRole)) {
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/portal');
        }
      }
    }
  }, [status, session, router, redirectTo, allowedRoles, requireAuth]);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const userRole = (user && 'role' in user ? user.role : null) as UserRole | null;

  return {
    isLoading,
    isAuthenticated,
    user,
    userRole,
    session,
  };
};

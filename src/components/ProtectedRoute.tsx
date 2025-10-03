'use client';

import { useAuth } from '@/hooks/useAuth';

type UserRole = 'admin' | 'user';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  allowedRoles = ['admin', 'user'],
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isLoading, isAuthenticated, userRole } = useAuth({
    redirectTo,
    allowedRoles,
    requireAuth: true,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
          fontSize: '1.2rem',
        }}
      >
        Vérification de l&apos;authentification...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
          fontSize: '1.2rem',
        }}
      >
        Redirection vers la page de connexion...
      </div>
    );
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
          fontSize: '1.2rem',
        }}
      >
        Redirection selon votre rôle...
      </div>
    );
  }

  return <>{children}</>;
};

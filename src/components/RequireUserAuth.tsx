'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type RequireUserAuthProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export const RequireUserAuth = ({ children, redirectTo = '/login' }: RequireUserAuthProps) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === 'loading') {
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
        Vérification de l'authentification...
      </div>
    );
  }

  if (status === 'unauthenticated') {
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
        Redirection en cours...
      </div>
    );
  }

  return <>{children}</>;
};

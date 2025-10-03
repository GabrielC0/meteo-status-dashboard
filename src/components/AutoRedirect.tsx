'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type AutoRedirectProps = {
  children?: React.ReactNode;
};

export const AutoRedirect = ({ children }: AutoRedirectProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = 'role' in session.user ? session.user.role : null;

      if (userRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/portal');
      }
    }
  }, [status, session, router]);

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

  if (status === 'authenticated') {
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

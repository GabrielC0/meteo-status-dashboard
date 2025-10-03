'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PageLayout } from '@/components/layout/PageLayout';

type User = {
  id: number;
  email: string;
  role: string;
};

const PortalPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification une seule fois
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Non authentifié, rediriger vers login
          router.push('/login');
        }
      } catch (_error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
          <h2>Chargement...</h2>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
          <h2>Redirection vers la page de connexion...</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ padding: '2rem', color: 'white' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
          }}
        >
          <div>
            <h1>Portal Client</h1>
            <p>
              Connecté en tant que : <strong>{user.email}</strong> ({user.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Déconnexion
          </button>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h2>🚀 Portal Client</h2>
          <p>Consultez les statuts des services et la qualité des données en temps réel.</p>
          <p>✅ Accès utilisateur autorisé</p>
          <p>✅ Système d'authentification ultra-simplifié</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default PortalPage;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PageLayout } from '@/components/layout/PageLayout';
import AdminStoreProvider from '@/components/providers/AdminStoreProvider';
import AdminUserInfo from '@/components/admin/AdminUserInfo';
import Dashboard from '@/features/weather-status/components/Dashboard';

type User = {
  id: number;
  email: string;
  role: string;
};

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification une seule fois
    const checkAuth = async () => {
      console.log("🔍 Page admin - Vérification de l'authentification...");
      try {
        const response = await fetch('/api/auth/me');
        console.log('📡 Réponse API /api/auth/me:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Utilisateur authentifié:', data.user);

          // Vérifier que l'utilisateur est admin
          if (data.user?.role === 'admin') {
            setUser(data.user);
          } else {
            console.log('❌ Utilisateur non admin, redirection vers portal');
            router.push('/portal');
          }
        } else {
          console.log('❌ Non authentifié, redirection vers login');
          router.push('/login');
        }
      } catch (error) {
        console.log('❌ Erreur lors de la vérification:', error);
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
      <AdminUserInfo user={user} onLogout={handleLogout} />
      <AdminStoreProvider>
        <Dashboard />
      </AdminStoreProvider>
    </PageLayout>
  );
};

export default AdminPage;

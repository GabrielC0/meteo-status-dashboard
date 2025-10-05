'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PageLayout } from '@/components/layout/PageLayout';
import AdminStoreProvider from '@/components/providers/AdminStoreProvider';
import UserInfo from '@/components/admin/UserInfo';
import Dashboard from '@/features/weather-status/components/Dashboard';
import type { User } from '@/types/User.types';
import styles from '@/styles/app/admin/page.module.scss';

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');

        if (response.ok) {
          const data = await response.json();

          if (data.user?.role === 'admin') {
            setUser(data.user);
          } else {
            router.push('/portal');
          }
        } else {
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
        <div className={styles.adminPage__loadingContainer}>
          <h2>Chargement...</h2>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className={styles.adminPage__redirectContainer}>
          <h2>Redirection vers la page de connexion...</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <UserInfo user={user} onLogout={handleLogout} />
      <AdminStoreProvider>
        <Dashboard />
      </AdminStoreProvider>
    </PageLayout>
  );
};

export default AdminPage;

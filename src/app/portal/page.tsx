'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PageLayout } from '@/components/layout/PageLayout';
import { PortalUserInfo } from '@/components/portal';
import type { User } from '@/types/User.types';
import styles from '@/styles/app/portal/page.module.scss';

const PortalPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
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
        <div className={styles.portalPage__loadingContainer}>
          <h2>Chargement...</h2>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className={styles.portalPage__redirectContainer}>
          <h2>Redirection vers la page de connexion...</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PortalUserInfo user={user} isLoading={isLoading} onLogout={handleLogout} />

      <div className={styles.portalPage__mainContent}>
        <h1 className={styles.portalPage__title}>Portal Client</h1>
        <p className={styles.portalPage__description}>Consultez les statuts des services et la qualité des données en temps réel.</p>
        <div className={styles.portalPage__servicesGrid}>
          <div className={`${styles.portalPage__serviceCard} ${styles['portalPage__serviceCard--titan']}`}>
            <h3 className={styles.portalPage__serviceTitle}>Services TITAN</h3>
            <p className={styles.portalPage__serviceStatus}>Opérationnel</p>
          </div>
          <div className={`${styles.portalPage__serviceCard} ${styles['portalPage__serviceCard--market']}`}>
            <h3 className={styles.portalPage__serviceTitle}>Données de Marché</h3>
            <p className={styles.portalPage__serviceStatus}>Actives</p>
          </div>
          <div className={`${styles.portalPage__serviceCard} ${styles['portalPage__serviceCard--system']}`}>
            <h3 className={styles.portalPage__serviceTitle}>Système</h3>
            <p className={styles.portalPage__serviceStatus}>✅ Accès utilisateur autorisé</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PortalPage;

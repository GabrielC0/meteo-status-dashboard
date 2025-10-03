'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';

import { PageLayout } from '@/components/layout/PageLayout';
import { LogoutIcon } from '@/components/Icons';
import { logout, setUser, getUser } from '@/app/redux/reducers/loginRed';
import type { AppDispatch, RootState } from '@/stores';

import userInfoStyles from './PortalUserInfo.module.scss';

const PortalPage = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { session, userRole } = useAuth({ requireAuth: true, allowedRoles: ['admin', 'user'] });
  const user = useSelector((state: RootState) => getUser(state));

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session?.user && !user) {
      dispatch(
        setUser({
          id: 1,
          email: session.user.email || '',
          role: userRole || 'user',
        }),
      );
    }
  }, [session, user, userRole, dispatch]);

  const handleSignOut = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!user) {
    return <div className={userInfoStyles.userInfo__loading}>Chargement...</div>;
  }

  return (
    <PageLayout>
      <div className={userInfoStyles.userInfo}>
        <span className={userInfoStyles.userInfo__session}>
          <div className={userInfoStyles.userInfo__statusIndicator}></div>
          <span>
            Connecté en tant que{' '}
            <strong className={userInfoStyles.userInfo__userName}>{user.email}</strong>
          </span>
        </span>
        <button
          onClick={handleSignOut}
          className={userInfoStyles.userInfo__logoutButton}
          title="Déconnexion"
        >
          <LogoutIcon width={16} height={16} className={userInfoStyles.userInfo__logoutIcon} />
        </button>
      </div>

      <div
        style={{
          padding: '2rem',
          color: 'white',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h1>Portal Client</h1>
        <p>Consultez les statuts des services et la qualité des données en temps réel.</p>
        <div
          style={{
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              background: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(40, 167, 69, 0.3)',
            }}
          >
            <h3>Services TITAN</h3>
            <p>Opérationnel</p>
          </div>
          <div
            style={{
              padding: '1rem',
              background: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(40, 167, 69, 0.3)',
            }}
          >
            <h3>Données de Marché</h3>
            <p>Actives</p>
          </div>
          <div
            style={{
              padding: '1rem',
              background: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(40, 167, 69, 0.3)',
            }}
          >
            <h3>Dernière Mise à Jour</h3>
            <p>{currentTime || 'Chargement...'}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PortalPage;

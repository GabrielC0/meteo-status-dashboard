'use client';

import React, { useState } from 'react';

import { PageLayout } from '@/components/layout/PageLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import styles from '@/styles/app/login/page.module.scss';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const redirectUrl = data.user?.role === 'admin' ? '/admin' : '/portal';
        window.location.href = redirectUrl;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur de connexion');
      }
    } catch (_error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className={styles.loginPage__container}>
        <div className={styles.loginPage__formContainer}>
          <div className={styles.loginPage__header}>
            <h1 className={styles.loginPage__title}>
              Connexion
            </h1>
            <p className={styles.loginPage__subtitle}>
              Accédez à votre tableau de bord
            </p>
          </div>

          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <div className={styles.loginPage__footer}>
            <a
              href="#"
              className={styles.loginPage__forgotPassword}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;

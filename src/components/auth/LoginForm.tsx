'use client';

import React, { useState } from 'react';
import type { LoginFormProps } from '@/types/Component.types';
import styles from '@/styles/components/auth/LoginForm.module.scss';

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.loginForm__form}
    >
      <div className={styles.loginForm__inputGroup}>
        <label className={styles.loginForm__label}>
          Adresse email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.loginForm__input}
          placeholder="votre@email.com"
        />
      </div>

      <div className={styles.loginForm__inputGroup}>
        <label className={styles.loginForm__label}>
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.loginForm__input}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className={styles.loginForm__error}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.loginForm__submitButton}
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};

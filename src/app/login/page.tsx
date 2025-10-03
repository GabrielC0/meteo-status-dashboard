'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PageLayout } from '@/components/layout/PageLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        console.log('Connexion réussie:', data);

        // Redirection basée sur le rôle
        if (data.user?.role === 'admin') {
          console.log('Redirection vers /admin');
          window.location.href = '/admin';
        } else {
          console.log('Redirection vers /portal');
          window.location.href = '/portal';
        }
      } else {
        const errorData = await response.json();
        console.log('Erreur de connexion:', errorData);
        setError(errorData.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1
              style={{
                color: 'white',
                fontSize: '1.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              Connexion
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
              }}
            >
              Accédez à votre tableau de bord
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#ef4444',
                fontSize: '0.875rem',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}
              >
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isLoading
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'linear-gradient(135deg, #0099FF 0%, #00568a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0088ee 0%, #004a7a 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #0099FF 0%, #00568a 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
            }}
          >
            <a
              href="#"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
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

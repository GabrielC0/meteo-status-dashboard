import { signIn, signOut } from 'next-auth/react';

import type { User } from '@/types';

export type LoginResult = {
  'Session-Token': string;
  webSocketUrl?: string;
  user: User;
};

export type LoginInfo = {
  timeoutLength: number;
  titanDate: number;
  user: User;
};

class LoginService {
  private sessionToken: string | null = null;
  private webSocketPath: string | null = null;
  private timeoutLength: number = 900;
  private loginTime: number = 0;
  private titanDate: number = 0;

  simpleLogin = async (
    userName: string,
    userPassword: string,
    email: string,
  ): Promise<LoginResult> => {
    try {
      const result = await signIn('credentials', {
        email,
        password: userPassword,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Identifiants incorrects');
      }

      const sessionToken = this.generateSessionToken();
      this.sessionToken = sessionToken;

      const userResponse = await fetch('/api/auth/user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!userResponse.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      const user = await userResponse.json();
      this.loginTime = Date.now();

      return {
        'Session-Token': sessionToken,
        webSocketUrl: '/api/websocket',
        user,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  postLogin = async (): Promise<void> => {
    console.log('✅ Initialisation post-connexion terminée');
  };

  logout = async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      this.sessionToken = null;
      this.webSocketPath = null;
      this.loginTime = 0;

      if (typeof window !== 'undefined') {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith('appStorage_')) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  sendPing = async (): Promise<boolean> => {
    try {
      if (!this.sessionToken) {
        return false;
      }

      const response = await fetch('/api/auth/ping', {
        method: 'POST',
        headers: {
          'Session-Token': this.sessionToken,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await this.logout();
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Erreur lors du ping:', error);
      return false;
    }
  };

  initializeApp = async (): Promise<void> => {
    try {
      console.log("🚀 Initialisation de l'application...");

      await this.getLoginInfo();

      await this.postLogin();

      console.log('✅ Initialisation terminée avec succès');
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation:", error);
      throw error;
    }
  };

  getLoginInfo = async (): Promise<LoginInfo> => {
    try {
      if (!this.sessionToken) {
        throw new Error('Session non initialisée');
      }

      const response = await fetch('/api/auth/login-info', {
        headers: {
          'Session-Token': this.sessionToken,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de connexion');
      }

      const data = await response.json();

      this.timeoutLength = data.timeoutLength || 900;
      this.titanDate = data.titanDate || Date.now();

      return {
        timeoutLength: this.timeoutLength,
        titanDate: this.titanDate,
        user: data.user,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de connexion:', error);
      throw error;
    }
  };

  getSessionToken = (): string | null => this.sessionToken;
  getWebSocketPath = (): string | null => this.webSocketPath;
  getTimeoutLength = (): number => this.timeoutLength;
  getLoginTime = (): number => this.loginTime;
  getTitanDate = (): number => this.titanDate;

  setSessionToken = (token: string): void => {
    this.sessionToken = token;
  };

  setWebSocketPath = (path: string): void => {
    this.webSocketPath = path;
  };

  private generateSessionToken = (): string => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  isSessionValid = (): boolean => {
    if (!this.sessionToken || !this.loginTime) {
      return false;
    }

    const now = Date.now();
    const sessionDuration = now - this.loginTime;
    const maxDuration = this.timeoutLength * 1000;

    return sessionDuration < maxDuration;
  };
}

export const $login = new LoginService();

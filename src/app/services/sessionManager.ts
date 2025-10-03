import { $login } from './login';

class SessionManager {
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 15 * 60 * 1000;

  startPing = (): void => {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(async () => {
      try {
        const isAlive = await $login.sendPing();
        if (!isAlive) {
          console.warn('Session expirée, déconnexion automatique');
          await $login.logout();
          this.stopPing();

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Erreur lors du ping de session:', error);
      }
    }, this.PING_INTERVAL);
  };

  stopPing = (): void => {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  };

  isSessionValid = (): boolean => {
    return $login.isSessionValid();
  };

  getSessionInfo = () => {
    return {
      sessionToken: $login.getSessionToken(),
      webSocketPath: $login.getWebSocketPath(),
      timeoutLength: $login.getTimeoutLength(),
      loginTime: $login.getLoginTime(),
      titanDate: $login.getTitanDate(),
    };
  };
}

export const sessionManager = new SessionManager();

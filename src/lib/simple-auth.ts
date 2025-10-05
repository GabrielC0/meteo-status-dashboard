import { cookies } from 'next/headers';
import { userService } from '@/lib/db/$users';
import type { AuthUser } from '@/types/User.types';

export const login = async (email: string, password: string) => {
  try {
    const user = await userService.verifyCredentials(email, password);
    if (user) {
      const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
      return { success: true, user: { id: user.id, email: user.email, role: user.role }, token };
    }
    return { success: false, error: 'Identifiants incorrects' };
  } catch (_error) {
    return { success: false, error: 'Erreur de connexion' };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    console.log('🍪 Cookie auth-token trouvé:', !!token);

    if (!token) {
      console.log('❌ Aucun cookie auth-token');
      return null;
    }

    const decoded = Buffer.from(token, 'base64').toString();
    const [id, email, timestamp] = decoded.split(':');
    console.log('🔓 Token décodé:', { id, email, timestamp });

    const tokenAge = Date.now() - parseInt(timestamp);
    console.log('⏰ Âge du token:', tokenAge, 'ms');

    if (tokenAge > 24 * 60 * 60 * 1000) {
      console.log('❌ Token expiré');
      return null;
    }

    const user = await userService.getUserByEmail(email);
    console.log('👤 Utilisateur de la DB:', user);

    return user ? { id: user.id, email: user.email, role: user.role } : null;
  } catch (error) {
    console.log('❌ Erreur dans getCurrentUser:', error);
    return null;
  }
};

export const logout = () => {
  return { success: true };
};

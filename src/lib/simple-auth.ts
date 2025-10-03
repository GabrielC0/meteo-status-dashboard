import { cookies } from 'next/headers';
import { userService } from '@/lib/db/$users';

export async function login(email: string, password: string) {
  try {
    const user = await userService.verifyCredentials(email, password);
    if (user) {
      // Créer un token simple
      const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
      return { success: true, user: { id: user.id, email: user.email, role: user.role }, token };
    }
    return { success: false, error: 'Identifiants incorrects' };
  } catch (error) {
    return { success: false, error: 'Erreur de connexion' };
  }
}

export async function getCurrentUser() {
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

    // Vérifier que le token n'est pas trop ancien (24h)
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
}

export function logout() {
  // La suppression du cookie sera gérée côté client
  return { success: true };
}

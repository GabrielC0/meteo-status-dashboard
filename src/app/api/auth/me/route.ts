import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/simple-auth';

export async function GET() {
  try {
    console.log('🔍 API /api/auth/me - Vérification du cookie...');
    const user = await getCurrentUser();
    console.log('👤 Utilisateur récupéré:', user);

    if (user) {
      console.log('✅ Utilisateur authentifié, retour des données');
      return NextResponse.json({ user });
    }

    console.log('❌ Aucun utilisateur trouvé, retour 401');
    return NextResponse.json({ user: null }, { status: 401 });
  } catch (error) {
    console.log('❌ Erreur dans /api/auth/me:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

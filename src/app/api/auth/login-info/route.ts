import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { hasUser } from '@/lib/auth/guards';

const GET = async (request: NextRequest) => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;
    const sessionToken = request.headers.get('Session-Token');

    if (!hasUser(session) || !sessionToken) {
      return NextResponse.json({ error: 'Session non valide' }, { status: 401 });
    }

    const loginInfo = {
      timeoutLength: 900,
      titanDate: Date.now(),
      user: {
        id: session.user?.id || '',
        email: session.user?.email || '',
        name: session.user?.name || session.user?.email?.split('@')[0] || 'Utilisateur',
        role: session.user?.role || 'user',
      },
    };

    return NextResponse.json(loginInfo);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de connexion:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
};

export { GET };

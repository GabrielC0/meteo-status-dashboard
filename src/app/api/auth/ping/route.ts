import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { hasUser } from '@/lib/auth/guards';

const POST = async (request: NextRequest) => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;
    const sessionToken = request.headers.get('Session-Token');

    if (!hasUser(session) || !sessionToken) {
      return NextResponse.json({ error: 'Session non valide' }, { status: 401 });
    }

    if (sessionToken !== `session_${session.user.id}_${Date.now()}`) {
      return NextResponse.json({ error: 'Token de session invalide' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      user: {
        id: session.user?.id || '',
        email: session.user?.email || '',
        name: session.user?.email?.split('@')[0] || 'Utilisateur',
        role: session.user?.role || 'user',
      },
    });
  } catch (error) {
    console.error('Erreur lors du ping:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
};

export { POST };

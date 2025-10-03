import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { userService } from '@/lib/db/$users';

const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Session non valide' }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    await userService.updateLastLogin(user.id);

    const { ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur API user-info:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
};

export { POST };

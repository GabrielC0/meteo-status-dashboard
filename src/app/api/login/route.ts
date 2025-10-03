import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/simple-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const result = await login(email, password);

    if (result.success) {
      console.log('Login réussi:', result.user);
      const response = NextResponse.json({ success: true, user: result.user });

      // Créer un token simple
      const token = Buffer.from(`${result.user.id}:${result.user.email}:${Date.now()}`).toString(
        'base64',
      );

      // Définir le cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24h
      });

      console.log('Cookie défini, réponse envoyée');
      return response;
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

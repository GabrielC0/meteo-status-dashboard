import { NextRequest } from 'next/server';
import { login } from '@/lib/simple-auth';
import { createLoginResponse, createErrorResponse } from '@/lib/api-response';
import { setAuthCookie } from '@/lib/cookie-utils';

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();
    const result = await login(email, password);

    if (result.success && result.user) {
      const token = Buffer.from(`${result.user.id}:${result.user.email}:${Date.now()}`).toString(
        'base64',
      );
      const response = createLoginResponse(result.user);
      setAuthCookie(response, token);
      return response;
    }

    return createErrorResponse(result.error || 'Identifiants incorrects', 401);
  } catch (_error) {
    return createErrorResponse('Erreur serveur', 500);
  }
};

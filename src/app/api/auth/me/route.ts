import { getCurrentUser } from '@/lib/simple-auth';
import { createAuthResponse, createErrorResponse } from '@/lib/api-response';

export const GET = async () => {
  try {
    const user = await getCurrentUser();
    return user ? createAuthResponse(user) : createErrorResponse('Non authentifié', 401);
  } catch (_error) {
    return createErrorResponse("Erreur d'authentification", 401);
  }
};

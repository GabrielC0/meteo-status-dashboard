import { NextRequest } from 'next/server';

import { getCurrentUser } from '@/lib/simple-auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { query } from '@/lib/db/config';
import type { User, UpdateUserData } from '@/types/User.types';

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return createErrorResponse('Accès non autorisé', 403);
    }

    const { id } = await params;
    const userId = parseInt(id);
    const { email, password, role }: UpdateUserData = await request.json();

    if (!email || !role) {
      return createErrorResponse('Email et rôle sont requis', 400);
    }

    const name = email.split('@')[0];

    if (!['admin', 'user'].includes(role)) {
      return createErrorResponse('Rôle invalide', 400);
    }

    const existingUser = await query<{ id: number }[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId],
    );

    if (existingUser.length > 0) {
      return createErrorResponse('Un utilisateur avec cet email existe déjà', 409);
    }

    let updateQuery =
      'UPDATE users SET email = ?, name = ?, role = ?, updated_at = CURRENT_TIMESTAMP';
    const updateParams: (string | number)[] = [email, name, role];

    if (password && password.trim() !== '') {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(userId);

    await query(updateQuery, updateParams);

    const updatedUser = await query<User[]>(
      'SELECT id, email, name, role, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [userId],
    );

    if (updatedUser.length === 0) {
      return createErrorResponse('Utilisateur non trouvé', 404);
    }

    return createSuccessResponse(updatedUser[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return createErrorResponse("Erreur serveur lors de la mise à jour de l'utilisateur", 500);
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return createErrorResponse('Accès non autorisé', 403);
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (userId === 1) {
      return createErrorResponse(
        "Impossible de supprimer l'utilisateur administrateur principal",
        403,
      );
    }

    await query('DELETE FROM users WHERE id = ?', [userId]);

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return createErrorResponse("Erreur serveur lors de la suppression de l'utilisateur", 500);
  }
};

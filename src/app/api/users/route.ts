import { NextRequest } from 'next/server';

import { getCurrentUser } from '@/lib/simple-auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { query } from '@/lib/db/config';
import type { User, CreateUserData } from '@/types/User.types';

export const GET = async () => {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return createErrorResponse('Accès non autorisé', 403);
    }

    const users = await query<User[]>(
      'SELECT id, email, name, role, is_active, last_login, created_at, updated_at FROM users ORDER BY created_at DESC',
    );

    return createSuccessResponse(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return createErrorResponse('Erreur serveur lors de la récupération des utilisateurs', 500);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return createErrorResponse('Accès non autorisé', 403);
    }

    const { email, password, role }: CreateUserData = await request.json();

    if (!email || !password || !role) {
      return createErrorResponse('Tous les champs sont requis', 400);
    }

    const name = email.split('@')[0];

    if (!['admin', 'user'].includes(role)) {
      return createErrorResponse('Rôle invalide', 400);
    }

    const existingUser = await query<{ id: number }[]>('SELECT id FROM users WHERE email = ?', [
      email,
    ]);

    if (existingUser.length > 0) {
      return createErrorResponse('Un utilisateur avec cet email existe déjà', 409);
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query<{ insertId: number }>(
      'INSERT INTO users (email, password, name, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, role, true],
    );

    const newUser = await query<User[]>(
      'SELECT id, email, name, role, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [result.insertId],
    );

    return createSuccessResponse(newUser[0], 201);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return createErrorResponse("Erreur serveur lors de la création de l'utilisateur", 500);
  }
};

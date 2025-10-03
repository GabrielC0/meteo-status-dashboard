import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { userService } from '@/lib/db/$users';
import type { CreateUserData, SafeUser } from '@/types';
import { isAdminSession } from '@/lib/auth/guards';

const GET = async () => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;

    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const users = await userService.getAllUsers();

    const safeUsers: SafeUser[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.email.split('@')[0],
      role: user.role,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des utilisateurs' },
      { status: 500 },
    );
  }
};

const POST = async (request: NextRequest) => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;

    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 },
      );
    }

    const userData: CreateUserData = {
      email,
      password,
      name,
      role,
    };

    const newUser = await userService.createUser(userData);

    const safeUser: SafeUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      is_active: newUser.is_active,
      last_login: newUser.last_login,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de l'utilisateur" },
      { status: 500 },
    );
  }
};

export { GET, POST };

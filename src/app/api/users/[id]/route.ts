import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { userService } from '@/lib/db/$users';
import type { UpdateUserData, SafeUser } from '@/types';
import { isAdminSession } from '@/lib/auth/guards';

type RouteParams = {
  params: Promise<{ id: string }>;
};

const GET = async ({ params }: RouteParams) => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;

    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.email.split('@')[0],
      role: user.role,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération de l'utilisateur" },
      { status: 500 },
    );
  }
};

const PUT = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;

    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = await request.json();
    const { email, password, name, role, is_active } = body;

    if (id === 1) {
      return NextResponse.json(
        { error: "Impossible de modifier l'utilisateur admin principal" },
        { status: 403 },
      );
    }

    const updateData: UpdateUserData = {};

    if (email !== undefined) updateData.email = email;
    if (password !== undefined && password !== '') updateData.password = password;
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    if (email) {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 409 },
        );
      }
    }

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const safeUser: SafeUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      is_active: updatedUser.is_active,
      last_login: updatedUser.last_login,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour de l'utilisateur" },
      { status: 500 },
    );
  }
};

const DELETE = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const sessionRaw = await getServerSession(authOptions);
    const session = typeof sessionRaw === 'object' && sessionRaw !== null ? sessionRaw : null;

    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    if (id === 1) {
      return NextResponse.json(
        { error: "Impossible de supprimer l'utilisateur admin principal" },
        { status: 403 },
      );
    }

    const success = await userService.deleteUser(id);

    if (!success) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression de l'utilisateur" },
      { status: 500 },
    );
  }
};

export { GET, PUT, DELETE };

import { NextResponse } from 'next/server';
import type { AuthUser } from '@/types/User.types';

export const createSuccessResponse = <T>(data: T, status = 200) => {
  return NextResponse.json(data, { status });
};

export const createErrorResponse = (message: string, status = 500) => {
  return NextResponse.json({ error: message }, { status });
};

export const createAuthResponse = (user: AuthUser) => {
  return createSuccessResponse({ user });
};

export const createLoginResponse = (user: AuthUser) => {
  return createSuccessResponse({ success: true, user });
};

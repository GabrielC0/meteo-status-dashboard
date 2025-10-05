import { NextResponse } from 'next/server';

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60,
};

export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set('auth-token', token, COOKIE_CONFIG);
};

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set('auth-token', '', { ...COOKIE_CONFIG, maxAge: 0 });
};

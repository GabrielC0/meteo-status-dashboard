import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/cookie-utils';

export const POST = async () => {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
};

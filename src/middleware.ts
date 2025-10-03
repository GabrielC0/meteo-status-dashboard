import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const middleware = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
  });

  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // FIXE AS
  const userRole = (token as { role: string }).role;

  switch (true) {
    case pathname.startsWith('/admin'):
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/portal', request.url));
      }
      break;

    case pathname.startsWith('/portal'):
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      break;

    case pathname.startsWith('/dashboard'):
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/portal', request.url));
      }
      break;

    case pathname.startsWith('/api/protected'):
      return NextResponse.next();
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*', '/dashboard/:path*', '/api/protected/:path*'],
};

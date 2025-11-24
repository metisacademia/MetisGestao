import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname === '/login' && token) {
    const payload = verifyToken(token);
    if (payload) {
      if (payload.perfil === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/moderador', request.url));
      }
    }
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/moderador')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/admin') && payload.perfil !== 'ADMIN') {
      return NextResponse.redirect(new URL('/moderador', request.url));
    }

    if (pathname.startsWith('/moderador') && payload.perfil !== 'MODERADOR') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/moderador/:path*', '/login'],
};

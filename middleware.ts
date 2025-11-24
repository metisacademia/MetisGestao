import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface AuthPayload {
  userId: string;
  email: string;
  perfil: 'ADMIN' | 'MODERADOR';
}

async function verifyTokenEdge(token: string): Promise<AuthPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname === '/login' && token) {
    const payload = await verifyTokenEdge(token);
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

    const payload = await verifyTokenEdge(token);
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

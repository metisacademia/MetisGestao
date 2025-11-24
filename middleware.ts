import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Se está em /login e tem token, deixa passar (será redirecionado no cliente)
  if (pathname === '/login' && token) {
    return NextResponse.next();
  }

  // Se está tentando acessar /admin ou /moderador sem token, redireciona para login
  if ((pathname.startsWith('/admin') || pathname.startsWith('/moderador')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/moderador/:path*', '/login'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Se está em /login e tem token, deixa passar (será redirecionado no cliente)
  if (pathname === '/login' && token) {
    return NextResponse.next();
  }

  // Se está tentando acessar rotas protegidas sem token, redireciona para login
  const protectedRoutes = ['/admin', '/coordenador', '/moderador', '/aluno'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/coordenador/:path*', '/moderador/:path*', '/aluno/:path*', '/login'],
};

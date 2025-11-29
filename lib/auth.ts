import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'JWT_SECRET environment variable is not set. Using a development fallback secret.'
    );
    return 'development-secret';
  }

  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
      'Please configure it before starting the application.'
  );
}

function getJwtSecretKey() {
  const secret = getJwtSecret();
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  userId: string;
  email: string;
  perfil: 'ADMIN' | 'COORDENADOR' | 'MODERADOR' | 'ALUNO';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const secret = getJwtSecretKey();
  const jwtPayload: Record<string, unknown> = {
    userId: payload.userId,
    email: payload.email,
    perfil: payload.perfil,
  };
  const token = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

/**
 * Get authenticated user from token (cookie or Authorization header)
 * @param request Optional NextRequest object to check Authorization header
 * @returns JWTPayload if authenticated, null otherwise
 */
export async function getUserFromToken(request?: any): Promise<JWTPayload | null> {
  let token = await getAuthToken();

  // Fallback to Authorization header if no cookie
  if (!token && request) {
    const authHeader = request.headers?.get?.('authorization') || request.headers?.['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

/**
 * Role-based access control helper
 * Use this instead of manual auth checks in API routes
 * @param allowedRoles Array of roles that can access the resource
 * @returns Async function that validates request and returns user
 * @throws ApiError if unauthorized or forbidden
 *
 * @example
 * const user = await requireAuth(['ADMIN'])(request);
 */
export function requireAuth(allowedRoles: Array<'ADMIN' | 'COORDENADOR' | 'MODERADOR' | 'ALUNO'>) {
  return async (request: any): Promise<JWTPayload> => {
    const user = await getUserFromToken(request);

    if (!user) {
      throw new Error('Não autenticado');
    }

    if (!allowedRoles.includes(user.perfil)) {
      throw new Error('Sem permissão para acessar este recurso');
    }

    return user;
  };
}

/**
 * @deprecated Use getUserFromToken() instead. This function is kept for backward compatibility.
 * Will be removed in future versions.
 */
export async function verifyAuth(request: any): Promise<JWTPayload | null> {
  return getUserFromToken(request);
}

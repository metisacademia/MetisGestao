import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
    'Please configure it before starting the application.'
  );
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
  const secret = new TextEncoder().encode(JWT_SECRET);
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
    const secret = new TextEncoder().encode(JWT_SECRET);
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

export async function getUserFromToken(request?: any): Promise<JWTPayload | null> {
  let token = await getAuthToken();
  
  if (!token && request) {
    const authHeader = request.headers?.get?.('authorization') || request.headers?.['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }
  
  if (!token) return null;
  return verifyToken(token);
}

export async function verifyAuth(request: any): Promise<JWTPayload | null> {
  let token: string | undefined;
  
  const cookieHeader = request.headers?.get?.('cookie') || '';
  const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
  if (tokenMatch) {
    token = tokenMatch[1];
  }
  
  if (!token) {
    const authHeader = request.headers?.get?.('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }
  
  if (!token) return null;
  return verifyToken(token);
}

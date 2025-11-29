import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Custom API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Standardized error response handler
 * Converts various error types into consistent NextResponse format
 */
export function errorResponse(error: unknown): NextResponse {
  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const firstError = error.issues[0];
    return NextResponse.json(
      {
        error: firstError.message,
        field: firstError.path.join('.'),
        details: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (error instanceof Error) {
    // Unique constraint violation
    if (error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Registro duplicado. Este item já existe.' },
        { status: 400 }
      );
    }

    // Foreign key constraint violation
    if (error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'Referência inválida. Verifique os dados relacionados.' },
        { status: 400 }
      );
    }

    // Record not found
    if (error.message.includes('Record to update not found') ||
        error.message.includes('Record to delete not found')) {
      return NextResponse.json(
        { error: 'Registro não encontrado.' },
        { status: 404 }
      );
    }
  }

  // Log unexpected errors for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Unexpected error:', error);
  }

  // Generic error response (hide internal details in production)
  return NextResponse.json(
    { error: 'Erro interno do servidor. Tente novamente.' },
    { status: 500 }
  );
}

/**
 * Common API error constructors
 */
export const ApiErrors = {
  notFound: (resource: string = 'Recurso') =>
    new ApiError(404, `${resource} não encontrado`),

  unauthorized: (message: string = 'Não autenticado') =>
    new ApiError(401, message),

  forbidden: (message: string = 'Sem permissão para acessar este recurso') =>
    new ApiError(403, message),

  badRequest: (message: string, details?: any) =>
    new ApiError(400, message, details),

  conflict: (message: string = 'Conflito com dados existentes') =>
    new ApiError(409, message),

  internal: (message: string = 'Erro interno do servidor') =>
    new ApiError(500, message),
};

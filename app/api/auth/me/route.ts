import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        criado_em: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

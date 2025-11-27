import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { avaliacaoId } = await request.json();

    if (!avaliacaoId) {
      return NextResponse.json({ error: 'avaliacaoId é obrigatório' }, { status: 400 });
    }

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: avaliacaoId },
    });

    if (!avaliacao) {
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    if (avaliacao.status === 'RASCUNHO') {
      return NextResponse.json({ error: 'Avaliação já está em rascunho' }, { status: 400 });
    }

    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: { id: avaliacaoId },
      data: {
        status: 'RASCUNHO',
      },
    });

    return NextResponse.json({
      success: true,
      avaliacao: avaliacaoAtualizada,
    });
  } catch (error) {
    console.error('Erro ao reabrir avaliação:', error);
    return NextResponse.json(
      { error: 'Erro ao reabrir avaliação' },
      { status: 500 }
    );
  }
}

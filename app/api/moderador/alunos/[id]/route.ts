import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findFirst({
      where: {
        id,
        turma: {
          moderadorId: user.userId,
        },
      },
      include: {
        turma: {
          select: {
            nome_turma: true,
          },
        },
      },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    return NextResponse.json(aluno);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

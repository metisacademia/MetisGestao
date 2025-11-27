import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const alunosSemConta = await prisma.aluno.findMany({
      where: {
        usuarioId: null,
      },
      select: {
        id: true,
        nome: true,
        turma: {
          select: {
            nome_turma: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(alunosSemConta);
  } catch (error) {
    console.error('Erro ao buscar alunos sem conta:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

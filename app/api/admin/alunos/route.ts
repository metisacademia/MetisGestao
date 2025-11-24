import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const alunos = await prisma.aluno.findMany({
      include: {
        turma: {
          select: {
            nome_turma: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

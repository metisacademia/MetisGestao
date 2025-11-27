import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const turmas = await prisma.turma.findMany({
      include: {
        alunos: {
          orderBy: { nome: 'asc' },
        },
      },
    });

    const alunos = turmas.flatMap((turma) =>
      turma.alunos.map((aluno) => ({
        id: aluno.id,
        nome: aluno.nome,
        turma: {
          id: turma.id,
          nome_turma: turma.nome_turma,
        },
      }))
    );

    return NextResponse.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

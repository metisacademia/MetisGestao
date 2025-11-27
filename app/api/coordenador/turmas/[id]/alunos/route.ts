import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: turmaId } = await params;

    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
    });

    if (!turma) {
      return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
    }

    const alunos = await prisma.aluno.findMany({
      where: { turmaId },
      include: { turma: true },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos da turma:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

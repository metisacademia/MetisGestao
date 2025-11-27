import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ turmaId: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { turmaId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const mes = searchParams.get('mes');
    const ano = searchParams.get('ano');

    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
    });

    if (!turma) {
      return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
    }

    const where: Record<string, unknown> = { turmaId };
    if (mes) where.mes_referencia = Number(mes);
    if (ano) where.ano_referencia = Number(ano);

    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      include: {
        aluno: true,
        template: true,
      },
      orderBy: [{ ano_referencia: 'desc' }, { mes_referencia: 'desc' }],
    });

    return NextResponse.json(avaliacoes);
  } catch (error) {
    console.error('Erro ao buscar avaliações da turma:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

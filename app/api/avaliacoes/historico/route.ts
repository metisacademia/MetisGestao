import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const alunoId = searchParams.get('alunoId');

    if (!alunoId) {
      return NextResponse.json({ error: 'ID do aluno é obrigatório' }, { status: 400 });
    }

    // Buscar as últimas 3 avaliações concluídas do aluno
    const historico = await prisma.avaliacao.findMany({
      where: {
        alunoId: alunoId,
        status: 'CONCLUIDA',
      },
      select: {
        id: true,
        mes_referencia: true,
        ano_referencia: true,
        score_total: true,
        data_aplicacao: true,
      },
      orderBy: [
        { ano_referencia: 'desc' },
        { mes_referencia: 'desc' },
      ],
      take: 3,
    });

    return NextResponse.json(historico);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de avaliações' },
      { status: 500 }
    );
  }
}

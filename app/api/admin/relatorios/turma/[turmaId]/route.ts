import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ turmaId: string }> }
) {
  try {
    const { turmaId } = await params;
    
    const searchParams = request.nextUrl.searchParams;
    const mes = Number(searchParams.get('mes'));
    const ano = Number(searchParams.get('ano'));

    const alunos = await prisma.aluno.findMany({
      where: { turmaId },
      include: {
        avaliacoes: {
          where: {
            mes_referencia: mes,
            ano_referencia: ano,
            status: 'CONCLUIDA',
          },
        },
      },
    });

    const comparacao = alunos
      .filter((aluno) => aluno.avaliacoes.length > 0)
      .map((aluno) => ({
        nome: aluno.nome,
        score: aluno.avaliacoes[0].score_total,
      }));

    return NextResponse.json({ comparacao });
  } catch (error) {
    console.error('Erro ao gerar relatório da turma:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

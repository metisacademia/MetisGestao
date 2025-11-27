import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alunoId: string }> }
) {
  try {
    const { alunoId } = await params;
    
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { alunoId, status: 'CONCLUIDA' },
      orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
    });

    const evolucao = avaliacoes.map((av) => ({
      mes_ano: `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`,
      score_total: av.score_total,
      score_fluencia: av.score_fluencia_0a10,
      score_cultura: av.score_cultura_0a10,
      score_interpretacao: av.score_interpretacao_0a10,
      score_atencao: av.score_atencao_0a10,
      score_auto_percepcao: av.score_auto_percepcao_0a10,
    }));

    const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1];
    const radar = ultimaAvaliacao
      ? [
          { dominio: 'Fluência', aluno: ultimaAvaliacao.score_fluencia_0a10 },
          { dominio: 'Cultura', aluno: ultimaAvaliacao.score_cultura_0a10 },
          { dominio: 'Interpretação', aluno: ultimaAvaliacao.score_interpretacao_0a10 },
          { dominio: 'Atenção', aluno: ultimaAvaliacao.score_atencao_0a10 },
          { dominio: 'Auto-percepção', aluno: ultimaAvaliacao.score_auto_percepcao_0a10 },
        ]
      : [];

    return NextResponse.json({ evolucao, radar });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

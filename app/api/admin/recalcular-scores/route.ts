import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { calcularPontuacaoItem, calcularScoresPorDominio, calcularScoreTotal } from '@/lib/pontuacao';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const avaliacoes = await prisma.avaliacao.findMany({
      where: { status: 'CONCLUIDA' },
      include: {
        respostas: {
          include: {
            item: true,
          },
        },
        template: {
          include: {
            itens: {
              include: {
                dominio: true,
              },
            },
          },
        },
      },
    });

    let atualizadas = 0;

    for (const avaliacao of avaliacoes) {
      const respostasComPontuacao = avaliacao.respostas.map((resposta) => {
        const item = resposta.item;
        const pontuacao = calcularPontuacaoItem(resposta.valor_bruto, item.regra_pontuacao);

        return {
          itemId: item.id,
          dominioId: resposta.dominioId,
          valor_bruto: resposta.valor_bruto,
          pontuacao_item: pontuacao,
        };
      });

      const scoresPorDominio = calcularScoresPorDominio(
        respostasComPontuacao,
        avaliacao.template.itens.map((item) => ({
          dominioId: item.dominioId,
          regra_pontuacao: item.regra_pontuacao,
        }))
      );

      const scoreTotal = calcularScoreTotal(scoresPorDominio);

      const scores: Record<string, number> = {
        score_total: scoreTotal,
        score_fluencia: 0,
        score_cultura: 0,
        score_interpretacao: 0,
        score_atencao: 0,
        score_auto_percepcao: 0,
        score_fluencia_0a10: 0,
        score_cultura_0a10: 0,
        score_interpretacao_0a10: 0,
        score_atencao_0a10: 0,
        score_auto_percepcao_0a10: 0,
      };

      Object.entries(scoresPorDominio).forEach(([dominioId, score]) => {
        const dominio = avaliacao.template.itens.find((i) => i.dominioId === dominioId)?.dominio;
        if (!dominio) return;

        const nomeDominio = dominio.nome.toLowerCase();

        if (nomeDominio.includes('fluência') || nomeDominio.includes('fluencia')) {
          scores.score_fluencia = score.total;
          scores.score_fluencia_0a10 = score.score_0a10;
        } else if (nomeDominio.includes('cultura')) {
          scores.score_cultura = score.total;
          scores.score_cultura_0a10 = score.score_0a10;
        } else if (nomeDominio.includes('interpretação') || nomeDominio.includes('interpretacao')) {
          scores.score_interpretacao = score.total;
          scores.score_interpretacao_0a10 = score.score_0a10;
        } else if (nomeDominio.includes('atenção') || nomeDominio.includes('atencao')) {
          scores.score_atencao = score.total;
          scores.score_atencao_0a10 = score.score_0a10;
        } else if (nomeDominio.includes('auto')) {
          scores.score_auto_percepcao = score.total;
          scores.score_auto_percepcao_0a10 = score.score_0a10;
        }
      });

      await prisma.avaliacao.update({
        where: { id: avaliacao.id },
        data: scores,
      });

      atualizadas++;
    }

    return NextResponse.json({
      success: true,
      message: `${atualizadas} avaliações recalculadas com sucesso`,
      atualizadas,
    });
  } catch (error) {
    console.error('Erro ao recalcular scores:', error);
    return NextResponse.json(
      { error: 'Erro ao recalcular scores' },
      { status: 500 }
    );
  }
}

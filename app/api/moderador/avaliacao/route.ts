import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { calcularPontuacaoItem, calcularScoresPorDominio, calcularScoreTotal } from '@/lib/pontuacao';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { alunoId, templateId, mes_referencia, ano_referencia, respostas } =
      await request.json();

    const aluno = await prisma.aluno.findFirst({
      where: {
        id: alunoId,
        turma: {
          moderadorId: user.userId,
        },
      },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const template = await prisma.templateAvaliacao.findUnique({
      where: { id: templateId },
      include: {
        itens: {
          include: {
            dominio: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template não encontrado' }, { status: 404 });
    }

    if (!template.ativo) {
      return NextResponse.json(
        { error: 'O template selecionado não está mais ativo' },
        { status: 400 }
      );
    }

    if (template.mes_referencia !== mes_referencia || template.ano_referencia !== ano_referencia) {
      return NextResponse.json(
        { error: 'Template não corresponde ao mês/ano da avaliação' },
        { status: 400 }
      );
    }

    const avaliacaoExistente = await prisma.avaliacao.findFirst({
      where: {
        alunoId,
        mes_referencia,
        ano_referencia,
      },
    });

    if (avaliacaoExistente) {
      await prisma.respostaItem.deleteMany({
        where: { avaliacaoId: avaliacaoExistente.id },
      });
    }

    const respostasComPontuacao = template.itens
      .filter((item: any) => respostas[item.id])
      .map((item: any) => {
        const valor_bruto = respostas[item.id];
        const pontuacao = calcularPontuacaoItem(valor_bruto, item.regra_pontuacao);
        const valor_numerico = parseFloat(valor_bruto);

        return {
          itemId: item.id,
          dominioId: item.dominioId,
          valor_bruto,
          valor_numerico: isNaN(valor_numerico) ? null : valor_numerico,
          pontuacao_item: pontuacao,
        };
      });

    const scoresPorDominio = calcularScoresPorDominio(
      respostasComPontuacao,
      template.itens.map((item: any) => ({
        dominioId: item.dominioId,
        regra_pontuacao: item.regra_pontuacao,
      }))
    );

    const scoreTotal = calcularScoreTotal(scoresPorDominio);

    const scores: any = {
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

    Object.entries(scoresPorDominio).forEach(([dominioId, score]: any[]) => {
      const dominio = template.itens.find((i: any) => i.dominioId === dominioId)?.dominio;
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

    const avaliacao = avaliacaoExistente
      ? await prisma.avaliacao.update({
          where: { id: avaliacaoExistente.id },
          data: {
            status: 'CONCLUIDA',
            ...scores,
            respostas: {
              create: respostasComPontuacao.map((r: any) => ({
                itemId: r.itemId,
                dominioId: r.dominioId,
                valor_bruto: r.valor_bruto,
                valor_numerico: r.valor_numerico,
                pontuacao_item: r.pontuacao_item,
              })),
            },
          },
        })
      : await prisma.avaliacao.create({
          data: {
            alunoId,
            turmaId: aluno.turmaId,
            templateId,
            mes_referencia,
            ano_referencia,
            status: 'CONCLUIDA',
            ...scores,
            respostas: {
              create: respostasComPontuacao.map((r: any) => ({
                itemId: r.itemId,
                dominioId: r.dominioId,
                valor_bruto: r.valor_bruto,
                valor_numerico: r.valor_numerico,
                pontuacao_item: r.pontuacao_item,
              })),
            },
          },
        });

    return NextResponse.json(avaliacao);
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

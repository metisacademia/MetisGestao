import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { calcularPontuacaoItem, calcularScoresPorDominio, calcularScoreTotal } from '@/lib/pontuacao';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alunoId: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { alunoId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const mes = Number(searchParams.get('mes'));
    const ano = Number(searchParams.get('ano'));

    const avaliacao = await prisma.avaliacao.findFirst({
      where: {
        alunoId,
        mes_referencia: mes,
        ano_referencia: ano,
      },
      include: {
        respostas: true,
      },
    });

    if (!avaliacao) {
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    return NextResponse.json(avaliacao);
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ alunoId: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { alunoId, templateId, mes_referencia, ano_referencia, data_aplicacao, respostas } =
      await request.json();

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: { turma: true },
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
      .filter((item) => respostas[item.id])
      .map((item) => {
        const valor_bruto = respostas[item.id];
        const pontuacao = calcularPontuacaoItem(valor_bruto, item.regra_pontuacao);
        const valor_numerico = parseFloat(valor_bruto);

        return {
          itemId: item.id,
          dominioId: item.dominioId,
          valor_bruto,
          valor_numerico,
          pontuacao_item: pontuacao,
        };
      });

    const scores = calcularScoresPorDominio(respostasComPontuacao, template.itens);
    const scoreTotal = calcularScoreTotal(scores);

    const scoresToSave: any = {
      score_total: scoreTotal,
    };

    scores.forEach(({ dominio, score }) => {
      const nomeDominio = dominio.nome.toLowerCase();

      if (nomeDominio.includes('fluência') || nomeDominio.includes('fluencia')) {
        scoresToSave.score_fluencia = score.total;
        scoresToSave.score_fluencia_0a10 = score.score_0a10;
      } else if (nomeDominio.includes('cultura')) {
        scoresToSave.score_cultura = score.total;
        scoresToSave.score_cultura_0a10 = score.score_0a10;
      } else if (nomeDominio.includes('interpretação') || nomeDominio.includes('interpretacao')) {
        scoresToSave.score_interpretacao = score.total;
        scoresToSave.score_interpretacao_0a10 = score.score_0a10;
      } else if (nomeDominio.includes('atenção') || nomeDominio.includes('atencao')) {
        scoresToSave.score_atencao = score.total;
        scoresToSave.score_atencao_0a10 = score.score_0a10;
      } else if (nomeDominio.includes('auto')) {
        scoresToSave.score_auto_percepcao = score.total;
        scoresToSave.score_auto_percepcao_0a10 = score.score_0a10;
      }
    });

    const avaliacaoData = {
      alunoId,
      turmaId: aluno.turmaId,
      templateId,
      mes_referencia,
      ano_referencia,
      data_aplicacao: data_aplicacao ? new Date(data_aplicacao) : new Date(),
      status: 'CONCLUIDA' as const,
      ...scoresToSave,
    };

    const avaliacao = avaliacaoExistente
      ? await prisma.avaliacao.update({
          where: { id: avaliacaoExistente.id },
          data: avaliacaoData,
        })
      : await prisma.avaliacao.create({
          data: avaliacaoData,
        });

    await prisma.respostaItem.createMany({
      data: respostasComPontuacao.map((resp) => ({
        avaliacaoId: avaliacao.id,
        itemId: resp.itemId,
        dominioId: resp.dominioId,
        valor_bruto: resp.valor_bruto,
        valor_numerico: resp.valor_numerico,
        pontuacao_item: resp.pontuacao_item,
      })),
    });

    return NextResponse.json({ success: true, avaliacaoId: avaliacao.id });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar avaliação' },
      { status: 500 }
    );
  }
}

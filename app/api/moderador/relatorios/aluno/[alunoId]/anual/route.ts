import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { gerarResumoAnalitico, calcularVariacoes } from '@/lib/resumo-analitico';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alunoId: string }> }
) {
  try {
    const { alunoId } = await params;

    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findFirst({
      where: {
        id: alunoId,
        turma: { moderadorId: user.userId },
      },
      include: { turma: true },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear().toString());

    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        alunoId,
        ano_referencia: ano,
        status: 'CONCLUIDA',
      },
      orderBy: { mes_referencia: 'asc' },
    });

    const trimestres = [
      { nome: 'T1', meses: [1, 2, 3] },
      { nome: 'T2', meses: [4, 5, 6] },
      { nome: 'T3', meses: [7, 8, 9] },
      { nome: 'T4', meses: [10, 11, 12] },
    ];

    const mediasTrimestrais = trimestres.map((tri) => {
      const avsTri = avaliacoes.filter((a: typeof avaliacoes[0]) => tri.meses.includes(a.mes_referencia));
      if (avsTri.length === 0) {
        return { trimestre: tri.nome, dados: null };
      }
      return {
        trimestre: tri.nome,
        dados: {
          score_total: avsTri.reduce((s: number, a: typeof avsTri[0]) => s + a.score_total, 0) / avsTri.length,
          score_fluencia: avsTri.reduce((s: number, a: typeof avsTri[0]) => s + a.score_fluencia_0a10, 0) / avsTri.length,
          score_cultura: avsTri.reduce((s: number, a: typeof avsTri[0]) => s + a.score_cultura_0a10, 0) / avsTri.length,
          score_interpretacao: avsTri.reduce((s: number, a: typeof avsTri[0]) => s + a.score_interpretacao_0a10, 0) / avsTri.length,
          score_atencao: avsTri.reduce((s: number, a: typeof avsTri[0]) => s + a.score_atencao_0a10, 0) / avsTri.length,
          score_auto_percepcao: avsTri.reduce((s: number, a: typeof avsTri[0]) => s + a.score_auto_percepcao_0a10, 0) / avsTri.length,
        },
      };
    });

    const evolucaoTrimestral = mediasTrimestrais
      .filter((t) => t.dados)
      .map((t) => ({
        mes_ano: t.trimestre,
        ...t.dados!,
      }));

    let mediaAnual = null;
    if (avaliacoes.length > 0) {
      mediaAnual = {
        fluencia: avaliacoes.reduce((s: number, a: typeof avaliacoes[0]) => s + a.score_fluencia_0a10, 0) / avaliacoes.length,
        cultura: avaliacoes.reduce((s: number, a: typeof avaliacoes[0]) => s + a.score_cultura_0a10, 0) / avaliacoes.length,
        interpretacao: avaliacoes.reduce((s: number, a: typeof avaliacoes[0]) => s + a.score_interpretacao_0a10, 0) / avaliacoes.length,
        atencao: avaliacoes.reduce((s: number, a: typeof avaliacoes[0]) => s + a.score_atencao_0a10, 0) / avaliacoes.length,
        auto_percepcao: avaliacoes.reduce((s: number, a: typeof avaliacoes[0]) => s + a.score_auto_percepcao_0a10, 0) / avaliacoes.length,
      };
    }

    const radarAnual = mediaAnual
      ? [
          { dominio: 'Fluência', aluno: mediaAnual.fluencia },
          { dominio: 'Cultura', aluno: mediaAnual.cultura },
          { dominio: 'Interpretação', aluno: mediaAnual.interpretacao },
          { dominio: 'Atenção', aluno: mediaAnual.atencao },
          { dominio: 'Auto-percepção', aluno: mediaAnual.auto_percepcao },
        ]
      : [];

    const presencas = await prisma.presenca.findMany({
      where: {
        alunoId,
        data: {
          gte: new Date(ano, 0, 1),
          lte: new Date(ano, 11, 31),
        },
      },
    });

    const totalPresencas = presencas.filter((p: typeof presencas[0]) => p.presente).length;
    const totalSessoes = presencas.length;
    const presencaMediaAnual = totalSessoes > 0 ? (totalPresencas / totalSessoes) * 100 : 0;

    const evolucaoParaResumo = avaliacoes.map((av: typeof avaliacoes[0]) => ({
      score_total: av.score_total,
      score_fluencia: av.score_fluencia_0a10,
      score_cultura: av.score_cultura_0a10,
      score_interpretacao: av.score_interpretacao_0a10,
      score_atencao: av.score_atencao_0a10,
      score_auto_percepcao: av.score_auto_percepcao_0a10,
    }));

    const variacoes = calcularVariacoes(evolucaoParaResumo, 12);
    const resumoTexto = gerarResumoAnalitico({
      evolucao: evolucaoParaResumo,
      variacoes,
      presencas: [{ percentual: presencaMediaAnual }],
      periodoMeses: 12,
    });

    const anosDisponiveis = await prisma.avaliacao.findMany({
      where: { alunoId, status: 'CONCLUIDA' },
      select: { ano_referencia: true },
      distinct: ['ano_referencia'],
      orderBy: { ano_referencia: 'desc' },
    });

    return NextResponse.json({
      aluno: { id: aluno.id, nome: aluno.nome, turma: aluno.turma.nome_turma },
      ano,
      anosDisponiveis: anosDisponiveis.map((a: typeof anosDisponiveis[0]) => a.ano_referencia),
      evolucaoTrimestral,
      radarAnual,
      presencaMediaAnual,
      resumoTexto,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório anual:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

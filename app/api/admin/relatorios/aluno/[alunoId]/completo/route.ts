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
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: { turma: true },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || '6m';

    let dataInicio: Date | null = null;
    const agora = new Date();
    if (periodo === '3m') {
      dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 3, 1);
    } else if (periodo === '6m') {
      dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 6, 1);
    } else if (periodo === '12m') {
      dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 12, 1);
    }

    const whereAvaliacao: Record<string, unknown> = { alunoId, status: 'CONCLUIDA' };
    if (dataInicio) {
      whereAvaliacao.OR = [
        { ano_referencia: { gt: dataInicio.getFullYear() } },
        {
          ano_referencia: dataInicio.getFullYear(),
          mes_referencia: { gte: dataInicio.getMonth() + 1 },
        },
      ];
    }

    const avaliacoes = await prisma.avaliacao.findMany({
      where: whereAvaliacao,
      orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
    });

    // Buscar avaliações da turma (excluindo o aluno atual) para calcular média
    const avaliacoesTurmaPeriodo = await prisma.avaliacao.findMany({
      where: {
        turmaId: aluno.turmaId,
        alunoId: { not: alunoId },
        status: 'CONCLUIDA',
        ...(dataInicio && {
          OR: [
            { ano_referencia: { gt: dataInicio.getFullYear() } },
            {
              ano_referencia: dataInicio.getFullYear(),
              mes_referencia: { gte: dataInicio.getMonth() + 1 }
            }
          ]
        })
      },
      orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
    });

    // Calcular médias por mês da turma (excluindo o aluno)
    const mediasPorMes = new Map<string, number[]>();
    avaliacoesTurmaPeriodo.forEach((av: any) => {
      const key = `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`;
      if (!mediasPorMes.has(key)) {
        mediasPorMes.set(key, []);
      }
      mediasPorMes.get(key)!.push(av.score_total);
    });

    const evolucao = avaliacoes.map((av: any) => {
      const mesAno = `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`;
      const scoresDoMes = mediasPorMes.get(mesAno) || [];
      const mediaTurma = scoresDoMes.length > 0
        ? scoresDoMes.reduce((a: number, b: number) => a + b, 0) / scoresDoMes.length
        : null;

      return {
        mes_ano: mesAno,
        score_total: av.score_total,
        score_fluencia: av.score_fluencia_0a10,
        score_cultura: av.score_cultura_0a10,
        score_interpretacao: av.score_interpretacao_0a10,
        score_atencao: av.score_atencao_0a10,
        score_auto_percepcao: av.score_auto_percepcao_0a10,
        media_turma: mediaTurma,
      };
    });

    const evolucaoComMediaMovel = evolucao.map((item: any, idx: any, arr: any) => {
      if (idx < 2) return { ...item, media_movel: item.score_total };
      const soma = arr[idx].score_total + arr[idx - 1].score_total + arr[idx - 2].score_total;
      return { ...item, media_movel: soma / 3 };
    });

    // Radar com médias do período (não apenas última avaliação)
    let radar: Array<{ dominio: string; aluno: number; media?: number }> = [];
    let temMediaTurma = false;

    if (avaliacoes.length > 0) {
      // Calcular média do aluno no período
      const mediaAluno = {
        fluencia: avaliacoes.reduce((s: any, a: any) => s + a.score_fluencia_0a10, 0) / avaliacoes.length,
        cultura: avaliacoes.reduce((s: any, a: any) => s + a.score_cultura_0a10, 0) / avaliacoes.length,
        interpretacao: avaliacoes.reduce((s: any, a: any) => s + a.score_interpretacao_0a10, 0) / avaliacoes.length,
        atencao: avaliacoes.reduce((s: any, a: any) => s + a.score_atencao_0a10, 0) / avaliacoes.length,
        auto_percepcao: avaliacoes.reduce((s: any, a: any) => s + a.score_auto_percepcao_0a10, 0) / avaliacoes.length,
      };

      const alunoRadar = [
        { dominio: 'Fluência', aluno: Number(mediaAluno.fluencia.toFixed(1)) },
        { dominio: 'Cultura', aluno: Number(mediaAluno.cultura.toFixed(1)) },
        { dominio: 'Interpretação', aluno: Number(mediaAluno.interpretacao.toFixed(1)) },
        { dominio: 'Atenção', aluno: Number(mediaAluno.atencao.toFixed(1)) },
        { dominio: 'Auto-percepção', aluno: Number(mediaAluno.auto_percepcao.toFixed(1)) },
      ];

      // Calcular média da turma no período (excluindo o aluno)
      if (avaliacoesTurmaPeriodo.length > 0) {
        temMediaTurma = true;
        const mediaTurma = {
          fluencia: avaliacoesTurmaPeriodo.reduce((s: any, a: any) => s + a.score_fluencia_0a10, 0) / avaliacoesTurmaPeriodo.length,
          cultura: avaliacoesTurmaPeriodo.reduce((s: any, a: any) => s + a.score_cultura_0a10, 0) / avaliacoesTurmaPeriodo.length,
          interpretacao: avaliacoesTurmaPeriodo.reduce((s: any, a: any) => s + a.score_interpretacao_0a10, 0) / avaliacoesTurmaPeriodo.length,
          atencao: avaliacoesTurmaPeriodo.reduce((s: any, a: any) => s + a.score_atencao_0a10, 0) / avaliacoesTurmaPeriodo.length,
          auto_percepcao: avaliacoesTurmaPeriodo.reduce((s: any, a: any) => s + a.score_auto_percepcao_0a10, 0) / avaliacoesTurmaPeriodo.length,
        };

        radar = alunoRadar.map((item: any, idx: any) => ({
          ...item,
          media: Number([mediaTurma.fluencia, mediaTurma.cultura, mediaTurma.interpretacao, mediaTurma.atencao, mediaTurma.auto_percepcao][idx].toFixed(1)),
        }));
      } else {
        radar = alunoRadar;
      }
    }

    const presencas = await prisma.presenca.findMany({
      where: {
        alunoId,
        data: dataInicio ? { gte: dataInicio } : undefined,
      },
      orderBy: { data: 'asc' },
    });

    const presencasPorMes: Record<string, { presencas: number; total: number }> = {};
    presencas.forEach((p: any) => {
      const mesAno = `${String(p.data.getMonth() + 1).padStart(2, '0')}/${p.data.getFullYear()}`;
      if (!presencasPorMes[mesAno]) {
        presencasPorMes[mesAno] = { presencas: 0, total: 0 };
      }
      presencasPorMes[mesAno].total++;
      if (p.presente) {
        presencasPorMes[mesAno].presencas++;
      }
    });

    const dadosPresenca = Object.entries(presencasPorMes).map(([mesAno, dados]: any[]) => ({
      mes_ano: mesAno,
      presencas: dados.presencas,
      total_sessoes: dados.total,
      percentual: dados.total > 0 ? (dados.presencas / dados.total) * 100 : 0,
    }));

    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();
    const chaveMesAtual = `${String(mesAtual).padStart(2, '0')}/${anoAtual}`;
    const presencaMesAtual = presencasPorMes[chaveMesAtual] || { presencas: 0, total: 0 };

    const totalPresencas = dadosPresenca.reduce((s: any, p: any) => s + p.presencas, 0);
    const totalSessoes = dadosPresenca.reduce((s: any, p: any) => s + p.total_sessoes, 0);
    const presencaMedia6Meses = totalSessoes > 0 ? (totalPresencas / totalSessoes) * 100 : 0;

    const eventos = await prisma.eventoAluno.findMany({
      where: {
        alunoId,
        data: dataInicio ? { gte: dataInicio } : undefined,
      },
      orderBy: { data: 'desc' },
    });

    const eventosComMesAno = eventos.map((e: any) => ({
      ...e,
      mes_ano: `${String(e.data.getMonth() + 1).padStart(2, '0')}/${e.data.getFullYear()}`,
    }));

    const evolucaoComEventos = evolucaoComMediaMovel.map((item: any) => {
      const eventoDoMes = eventosComMesAno.find((e: any) => e.mes_ano === item.mes_ano);
      return {
        ...item,
        evento: eventoDoMes ? { titulo: eventoDoMes.titulo, tipo: eventoDoMes.tipo } : undefined,
      };
    });

    const periodoMeses = periodo === '3m' ? 3 : periodo === '6m' ? 6 : periodo === '12m' ? 12 : evolucao.length;
    const variacoes = calcularVariacoes(evolucao, periodoMeses);
    
    const cardsResumo = variacoes.map((v: any) => {
      const atual = evolucao.length > 0 ? evolucao[evolucao.length - 1] : null;
      const anterior = evolucao.length > periodoMeses ? evolucao[evolucao.length - periodoMeses - 1] : evolucao[0];
      
      const keyMap: Record<string, string> = {
        'Total': 'score_total',
        'Fluência': 'score_fluencia',
        'Cultura': 'score_cultura',
        'Interpretação': 'score_interpretacao',
        'Atenção': 'score_atencao',
        'Auto-percepção': 'score_auto_percepcao',
      };
      const key = keyMap[v.dominio] as keyof typeof atual;
      
      return {
        dominio: v.dominio,
        atual: atual ? (atual[key] as number) : 0,
        anterior: anterior ? (anterior[key] as number) : 0,
        variacao: v.variacao,
        tendencia: v.tendencia,
      };
    });

    const resumoTexto = gerarResumoAnalitico({
      evolucao,
      variacoes,
      presencas: dadosPresenca,
      periodoMeses,
    });

    // Tabela detalhada de avaliações (ordenada da mais recente para a mais antiga)
    const tabelaAvaliacoes = [...avaliacoes]
      .reverse()
      .map((av: any) => ({
        mes_ano: `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`,
        data_aplicacao: av.data_aplicacao.toISOString(),
        score_total: av.score_total,
        score_fluencia_0a10: av.score_fluencia_0a10,
        score_cultura_0a10: av.score_cultura_0a10,
        score_interpretacao_0a10: av.score_interpretacao_0a10,
        score_atencao_0a10: av.score_atencao_0a10,
        score_auto_percepcao_0a10: av.score_auto_percepcao_0a10,
      }));

    return NextResponse.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        turma: aluno.turma.nome_turma,
        data_nascimento: aluno.data_nascimento?.toISOString() || null,
        observacoes: aluno.observacoes || null,
      },
      evolucao: evolucaoComEventos,
      radar,
      radarPeriodo: periodo,
      temMediaTurma,
      cardsResumo,
      presenca: {
        dados: dadosPresenca,
        mesAtual: presencaMesAtual,
        media6Meses: presencaMedia6Meses,
      },
      eventos: eventos.map((e: any) => ({
        id: e.id,
        data: e.data.toISOString(),
        titulo: e.titulo,
        descricao: e.descricao,
        tipo: e.tipo,
      })),
      resumoTexto,
      tabelaAvaliacoes,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório completo:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

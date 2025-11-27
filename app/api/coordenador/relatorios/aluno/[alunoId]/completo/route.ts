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
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
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

    const evolucao = avaliacoes.map((av) => ({
      mes_ano: `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`,
      score_total: av.score_total,
      score_fluencia: av.score_fluencia_0a10,
      score_cultura: av.score_cultura_0a10,
      score_interpretacao: av.score_interpretacao_0a10,
      score_atencao: av.score_atencao_0a10,
      score_auto_percepcao: av.score_auto_percepcao_0a10,
    }));

    const evolucaoComMediaMovel = evolucao.map((item, idx, arr) => {
      if (idx < 2) return { ...item, media_movel: item.score_total };
      const soma = arr[idx].score_total + arr[idx - 1].score_total + arr[idx - 2].score_total;
      return { ...item, media_movel: soma / 3 };
    });

    const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1];
    
    let radar: Array<{ dominio: string; aluno: number; media?: number }> = [];
    let temMediaTurma = false;

    if (ultimaAvaliacao) {
      const alunoRadar = [
        { dominio: 'Fluência', aluno: ultimaAvaliacao.score_fluencia_0a10 },
        { dominio: 'Cultura', aluno: ultimaAvaliacao.score_cultura_0a10 },
        { dominio: 'Interpretação', aluno: ultimaAvaliacao.score_interpretacao_0a10 },
        { dominio: 'Atenção', aluno: ultimaAvaliacao.score_atencao_0a10 },
        { dominio: 'Auto-percepção', aluno: ultimaAvaliacao.score_auto_percepcao_0a10 },
      ];

      const avaliacoesTurma = await prisma.avaliacao.findMany({
        where: {
          turmaId: aluno.turmaId,
          mes_referencia: ultimaAvaliacao.mes_referencia,
          ano_referencia: ultimaAvaliacao.ano_referencia,
          status: 'CONCLUIDA',
          alunoId: { not: alunoId },
        },
      });

      if (avaliacoesTurma.length > 0) {
        temMediaTurma = true;
        const mediaTurma = {
          fluencia: avaliacoesTurma.reduce((s, a) => s + a.score_fluencia_0a10, 0) / avaliacoesTurma.length,
          cultura: avaliacoesTurma.reduce((s, a) => s + a.score_cultura_0a10, 0) / avaliacoesTurma.length,
          interpretacao: avaliacoesTurma.reduce((s, a) => s + a.score_interpretacao_0a10, 0) / avaliacoesTurma.length,
          atencao: avaliacoesTurma.reduce((s, a) => s + a.score_atencao_0a10, 0) / avaliacoesTurma.length,
          auto_percepcao: avaliacoesTurma.reduce((s, a) => s + a.score_auto_percepcao_0a10, 0) / avaliacoesTurma.length,
        };

        radar = alunoRadar.map((item, idx) => ({
          ...item,
          media: [mediaTurma.fluencia, mediaTurma.cultura, mediaTurma.interpretacao, mediaTurma.atencao, mediaTurma.auto_percepcao][idx],
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
    presencas.forEach((p) => {
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

    return NextResponse.json({
      aluno: { id: aluno.id, nome: aluno.nome, turma: aluno.turma.nome_turma },
      evolucao: evolucaoComEventos,
      radar,
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
    });
  } catch (error) {
    console.error('Erro ao gerar relatório completo:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

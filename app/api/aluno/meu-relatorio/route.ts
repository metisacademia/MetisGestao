import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { gerarRecomendacoesAluno, gerarResumoAmigavel, calcularTendencia } from '@/lib/recomendacoes-aluno';
import { subMonths } from 'date-fns';

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'ALUNO') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const alunoBase = await prisma.aluno.findFirst({
      where: { usuarioId: user.userId },
    });

    if (!alunoBase) {
      return NextResponse.json(
        { error: 'Perfil de aluno não encontrado' },
        { status: 404 }
      );
    }

    const turma = await prisma.turma.findUnique({
      where: { id: alunoBase.turmaId },
      include: { moderador: true },
    });

    const avaliacoes = await prisma.avaliacao.findMany({
      where: { alunoId: alunoBase.id, status: 'CONCLUIDA' },
      orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
    });

    const evolucao = avaliacoes.map((av: typeof avaliacoes[0]) => ({
      mes_ano: `${String(av.mes_referencia).padStart(2, '0')}/${av.ano_referencia}`,
      score_total: av.score_total,
      score_fluencia: av.score_fluencia_0a10,
      score_cultura: av.score_cultura_0a10,
      score_interpretacao: av.score_interpretacao_0a10,
      score_atencao: av.score_atencao_0a10,
      score_auto_percepcao: av.score_auto_percepcao_0a10,
    }));

    const ultimaAvaliacao = avaliacoes[avaliacoes.length - 1];
    const primeiraAvaliacao = avaliacoes[0];

    const radar = ultimaAvaliacao
      ? [
          { dominio: 'Fluência', aluno: ultimaAvaliacao.score_fluencia_0a10 },
          { dominio: 'Cultura', aluno: ultimaAvaliacao.score_cultura_0a10 },
          { dominio: 'Interpretação', aluno: ultimaAvaliacao.score_interpretacao_0a10 },
          { dominio: 'Atenção', aluno: ultimaAvaliacao.score_atencao_0a10 },
          { dominio: 'Auto-percepção', aluno: ultimaAvaliacao.score_auto_percepcao_0a10 },
        ]
      : [];

    let periodoInicio = '';
    let periodoFim = '';
    if (primeiraAvaliacao && ultimaAvaliacao) {
      const mesesNome = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      periodoInicio = `${mesesNome[primeiraAvaliacao.mes_referencia]}/${primeiraAvaliacao.ano_referencia}`;
      periodoFim = `${mesesNome[ultimaAvaliacao.mes_referencia]}/${ultimaAvaliacao.ano_referencia}`;
    }

    const agora = new Date();
    const seisMesesAtras = subMonths(agora, 6);

    const presencasData = await prisma.$queryRaw<{ id: string; presente: boolean }[]>`
      SELECT id, presente FROM "Presenca" 
      WHERE "alunoId" = ${alunoBase.id} 
      AND data >= ${seisMesesAtras} 
      AND data <= ${agora}
    `;

    const totalEncontros = presencasData.length;
    const presencasConfirmadas = presencasData.filter((p: typeof presencasData[0]) => p.presente).length;
    const percentualPresenca = totalEncontros > 0 
      ? Math.round((presencasConfirmadas / totalEncontros) * 100) 
      : 0;

    let statusPresenca: 'verde' | 'amarelo' | 'vermelho';
    if (percentualPresenca >= 75) {
      statusPresenca = 'verde';
    } else if (percentualPresenca >= 50) {
      statusPresenca = 'amarelo';
    } else {
      statusPresenca = 'vermelho';
    }

    const tendencia = calcularTendencia(evolucao);
    const resumo = gerarResumoAmigavel(evolucao, radar);
    const recomendacoes = gerarRecomendacoesAluno(radar, 3);

    const horarioTurma = turma 
      ? `${turma.nome_turma} – ${turma.dia_semana}, ${turma.horario}`
      : 'Turma não definida';

    return NextResponse.json({
      aluno: {
        id: alunoBase.id,
        nome: alunoBase.nome,
        turma: horarioTurma,
        moderadora: turma?.moderador?.nome || 'Moderadora',
      },
      periodo: {
        inicio: periodoInicio,
        fim: periodoFim,
      },
      evolucao,
      radar,
      tendencia: {
        direcao: tendencia.direcao,
        variacao: tendencia.variacao,
        frase: tendencia.frase,
        scoreAtual: ultimaAvaliacao?.score_total || 0,
      },
      presenca: {
        participou: presencasConfirmadas,
        total: totalEncontros,
        percentual: percentualPresenca,
        status: statusPresenca,
      },
      resumo,
      recomendacoes,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório do aluno:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

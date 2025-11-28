import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mes = parseInt(searchParams.get('mes') || String(new Date().getMonth() + 1));
    const ano = parseInt(searchParams.get('ano') || String(new Date().getFullYear()));
    const periodo = searchParams.get('periodo') || 'mes_atual';

    const monthsByPeriod: Record<string, number> = {
      mes_atual: 1,
      ultimo_trimestre: 3,
      ultimo_semestre: 6,
      ano: 12,
    };

    const monthsRange = monthsByPeriod[periodo] ?? 1;
    const periodEnd = new Date();
    periodEnd.setHours(23, 59, 59, 999);
    const periodStart = new Date(periodEnd);
    periodStart.setMonth(periodStart.getMonth() - (monthsRange - 1));
    periodStart.setDate(1);

    const turmas = await prisma.turma.findMany({
      include: {
        moderador: {
          select: {
            id: true,
            nome: true,
          },
        },
        alunos: {
          select: {
            id: true,
            nome: true,
          },
        },
        avaliacoes: {
          where: {
            mes_referencia: mes,
            ano_referencia: ano,
          },
          select: {
            id: true,
            alunoId: true,
            status: true,
          },
        },
      },
      orderBy: { nome_turma: 'asc' },
    });

    const turmasComEstatisticas = turmas.map((turma: typeof turmas[0]) => {
      const totalAlunos = turma.alunos.length;
      const avaliacoesPorAluno = new Map<string, { status: string }>();
      
      turma.avaliacoes.forEach((av: typeof turma.avaliacoes[0]) => {
        avaliacoesPorAluno.set(av.alunoId, { status: av.status });
      });

      const concluidas = Array.from(avaliacoesPorAluno.values()).filter(
        (av) => av.status === 'CONCLUIDA'
      ).length;
      const rascunhos = Array.from(avaliacoesPorAluno.values()).filter(
        (av) => av.status === 'RASCUNHO'
      ).length;
      const pendentes = totalAlunos - avaliacoesPorAluno.size;
      const percentualConcluido = totalAlunos > 0 ? Math.round((concluidas / totalAlunos) * 100) : 0;

      const alunosComStatus = turma.alunos.map((aluno: typeof turma.alunos[0]) => {
        const avaliacao = avaliacoesPorAluno.get(aluno.id);
        let status: 'PENDENTE' | 'RASCUNHO' | 'CONCLUIDA' = 'PENDENTE';
        if (avaliacao) {
          status = avaliacao.status as 'RASCUNHO' | 'CONCLUIDA';
        }
        return {
          id: aluno.id,
          nome: aluno.nome,
          status,
        };
      });

      return {
        id: turma.id,
        nome_turma: turma.nome_turma,
        moderador: turma.moderador,
        totalAlunos,
        concluidas,
        rascunhos,
        pendentes,
        percentualConcluido,
        alunos: alunosComStatus,
      };
    });

    const totalAvaliacoesMes = turmasComEstatisticas.reduce(
      (acc: number, t: typeof turmasComEstatisticas[0]) => acc + t.concluidas + t.rascunhos,
      0
    );
    const totalAlunosSistema = turmasComEstatisticas.reduce(
      (acc: number, t: typeof turmasComEstatisticas[0]) => acc + t.totalAlunos,
      0
    );
    const totalConcluidas = turmasComEstatisticas.reduce((acc: number, t: typeof turmasComEstatisticas[0]) => acc + t.concluidas, 0);
    const totalPendentes = turmasComEstatisticas.reduce((acc: number, t: typeof turmasComEstatisticas[0]) => acc + t.pendentes, 0);
    const totalRascunhos = turmasComEstatisticas.reduce((acc: number, t: typeof turmasComEstatisticas[0]) => acc + t.rascunhos, 0);
    const percentualGeralConclusao = totalAlunosSistema > 0
      ? Math.round((totalConcluidas / totalAlunosSistema) * 100)
      : 0;

    const avaliacoesPeriodo = await prisma.avaliacao.findMany({
      where: {
        data_aplicacao: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: 'CONCLUIDA',
      },
      select: {
        score_total: true,
      },
    });

    const totalRealizadasPeriodo = avaliacoesPeriodo.length;
    const mediaGeralPontuacao =
      totalRealizadasPeriodo > 0
        ? Number(
            (
              avaliacoesPeriodo.reduce((acc, aval) => acc + (aval.score_total || 0), 0) /
              totalRealizadasPeriodo
            ).toFixed(2)
          )
        : 0;

    const evolucaoUltimosMeses = await prisma.avaliacao.groupBy({
      by: ['ano_referencia', 'mes_referencia'],
      where: {
        data_aplicacao: {
          gte: (() => {
            const start = new Date(periodEnd);
            start.setMonth(start.getMonth() - 5);
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            return start;
          })(),
          lte: periodEnd,
        },
        status: 'CONCLUIDA',
      },
      _count: { id: true },
      orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
    });

    const serieUltimosSeisMeses = (() => {
      const items: { mes: number; ano: number; label: string; total: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const refDate = new Date(periodEnd);
        refDate.setMonth(refDate.getMonth() - i);
        const mesRef = refDate.getMonth() + 1;
        const anoRef = refDate.getFullYear();
        const encontrado = evolucaoUltimosMeses.find(
          (item) => item.mes_referencia === mesRef && item.ano_referencia === anoRef
        );
        items.push({
          mes: mesRef,
          ano: anoRef,
          label: `${String(mesRef).padStart(2, '0')}/${String(anoRef).slice(-2)}`,
          total: encontrado?._count.id ?? 0,
        });
      }
      return items;
    })();

    return NextResponse.json({
      mes,
      ano,
      estatisticasGerais: {
        totalAvaliacoesMes,
        totalAlunosSistema,
        totalConcluidas,
        totalPendentes,
        totalRascunhos,
        percentualGeralConclusao,
      },
      periodoResumo: {
        totalRealizadasPeriodo,
        mediaGeralPontuacao,
        pendentesMes: totalPendentes,
      },
      evolucaoUltimosMeses: serieUltimosSeisMeses,
      turmas: turmasComEstatisticas,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

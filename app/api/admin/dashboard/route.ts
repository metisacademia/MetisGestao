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

    const turmasComEstatisticas = turmas.map((turma) => {
      const totalAlunos = turma.alunos.length;
      const avaliacoesPorAluno = new Map<string, { status: string }>();
      
      turma.avaliacoes.forEach((av) => {
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

      const alunosComStatus = turma.alunos.map((aluno) => {
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
      (acc, t) => acc + t.concluidas + t.rascunhos,
      0
    );
    const totalAlunosSistema = turmasComEstatisticas.reduce(
      (acc, t) => acc + t.totalAlunos,
      0
    );
    const totalConcluidas = turmasComEstatisticas.reduce((acc, t) => acc + t.concluidas, 0);
    const totalPendentes = turmasComEstatisticas.reduce((acc, t) => acc + t.pendentes, 0);
    const totalRascunhos = turmasComEstatisticas.reduce((acc, t) => acc + t.rascunhos, 0);
    const percentualGeralConclusao = totalAlunosSistema > 0 
      ? Math.round((totalConcluidas / totalAlunosSistema) * 100) 
      : 0;

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
      turmas: turmasComEstatisticas,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

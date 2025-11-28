import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { calcularDataInicio, buildPeriodoWhereClause, type Periodo } from '@/lib/periodo-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ turmaId: string }> }
) {
  try {
    const { turmaId } = await params;

    // Autenticação
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const periodo = (searchParams.get('periodo') || '1m') as Periodo;

    // Buscar dados da turma
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        moderador: {
          select: { id: true, nome: true }
        },
        alunos: {
          select: { id: true, nome: true },
          orderBy: { nome: 'asc' }
        }
      }
    });

    if (!turma) {
      return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
    }

    // Calcular período
    const dataInicio = calcularDataInicio(periodo);
    const whereClause = buildPeriodoWhereClause(dataInicio);

    // Buscar todas as avaliações da turma no período
    const avaliacoesPeriodo = await prisma.avaliacao.findMany({
      where: {
        turmaId,
        status: 'CONCLUIDA',
        ...whereClause
      },
      orderBy: [
        { ano_referencia: 'desc' },
        { mes_referencia: 'desc' }
      ],
      include: {
        aluno: {
          select: { id: true, nome: true }
        }
      }
    });

    // Agrupar avaliações por aluno (pegar a mais recente de cada aluno no período)
    const avaliacoesPorAluno = new Map<string, any>();
    avaliacoesPeriodo.forEach((av) => {
      if (!avaliacoesPorAluno.has(av.alunoId)) {
        avaliacoesPorAluno.set(av.alunoId, av);
      }
    });

    // Construir dados de comparação
    const comparacao = turma.alunos.map((aluno) => {
      const avaliacao = avaliacoesPorAluno.get(aluno.id);

      if (avaliacao) {
        return {
          alunoId: aluno.id,
          nome: aluno.nome,
          score_total: avaliacao.score_total,
          temAvaliacao: true,
          posicao: 0 // Será calculado depois
        };
      } else {
        return {
          alunoId: aluno.id,
          nome: aluno.nome,
          score_total: null,
          temAvaliacao: false,
          posicao: null
        };
      }
    });

    // Separar alunos com e sem avaliação
    const alunosComAvaliacao = comparacao.filter((a) => a.temAvaliacao);
    const alunosSemAvaliacao = comparacao.filter((a) => !a.temAvaliacao);

    // Ordenar alunos com avaliação por score (decrescente)
    alunosComAvaliacao.sort((a, b) => (b.score_total || 0) - (a.score_total || 0));

    // Atribuir posições
    alunosComAvaliacao.forEach((aluno, index) => {
      aluno.posicao = index + 1;
    });

    // Ordenar alunos sem avaliação por nome
    alunosSemAvaliacao.sort((a, b) => a.nome.localeCompare(b.nome));

    // Combinar: avaliados primeiro, depois não avaliados
    const comparacaoOrdenada = [...alunosComAvaliacao, ...alunosSemAvaliacao];

    // Calcular estatísticas
    const scoresValidos = alunosComAvaliacao
      .map((a) => a.score_total)
      .filter((s): s is number => s !== null);

    let estatisticas = {
      media_geral: 0,
      mediana: 0,
      total_avaliacoes: scoresValidos.length,
      alunos_sem_avaliacao: alunosSemAvaliacao.length
    };

    if (scoresValidos.length > 0) {
      // Média
      const soma = scoresValidos.reduce((acc, val) => acc + val, 0);
      estatisticas.media_geral = Number((soma / scoresValidos.length).toFixed(2));

      // Mediana
      const sorted = [...scoresValidos].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      estatisticas.mediana = sorted.length % 2 === 0
        ? Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2))
        : Number(sorted[mid].toFixed(2));
    }

    // Calcular radar da turma (média por domínio no período)
    let radarTurma: Array<{ dominio: string; media: number }> = [];

    if (avaliacoesPeriodo.length > 0) {
      const mediaDominios = {
        fluencia: avaliacoesPeriodo.reduce((s, a) => s + a.score_fluencia_0a10, 0) / avaliacoesPeriodo.length,
        cultura: avaliacoesPeriodo.reduce((s, a) => s + a.score_cultura_0a10, 0) / avaliacoesPeriodo.length,
        interpretacao: avaliacoesPeriodo.reduce((s, a) => s + a.score_interpretacao_0a10, 0) / avaliacoesPeriodo.length,
        atencao: avaliacoesPeriodo.reduce((s, a) => s + a.score_atencao_0a10, 0) / avaliacoesPeriodo.length,
        auto_percepcao: avaliacoesPeriodo.reduce((s, a) => s + a.score_auto_percepcao_0a10, 0) / avaliacoesPeriodo.length,
      };

      radarTurma = [
        { dominio: 'Fluência', media: Number(mediaDominios.fluencia.toFixed(1)) },
        { dominio: 'Cultura', media: Number(mediaDominios.cultura.toFixed(1)) },
        { dominio: 'Interpretação', media: Number(mediaDominios.interpretacao.toFixed(1)) },
        { dominio: 'Atenção', media: Number(mediaDominios.atencao.toFixed(1)) },
        { dominio: 'Auto-percepção', media: Number(mediaDominios.auto_percepcao.toFixed(1)) },
      ];
    }

    return NextResponse.json({
      turma: {
        id: turma.id,
        nome_turma: turma.nome_turma,
        moderador: turma.moderador,
        dia_semana: turma.dia_semana,
        horario: turma.horario,
        turno: turma.turno,
        total_alunos: turma.alunos.length
      },
      comparacao: comparacaoOrdenada,
      radarTurma,
      estatisticas
    });
  } catch (error) {
    console.error('Erro ao gerar relatório da turma:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

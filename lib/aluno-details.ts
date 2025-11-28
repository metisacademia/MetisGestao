import { prisma } from '@/lib/prisma';

const dominioLabels = {
  score_fluencia_0a10: 'Fluência',
  score_cultura_0a10: 'Cultura',
  score_interpretacao_0a10: 'Interpretação',
  score_atencao_0a10: 'Atenção',
  score_auto_percepcao_0a10: 'Auto-percepção',
} as const;

type DominioKey = keyof typeof dominioLabels;

export interface AlunoDetalhes {
  aluno: {
    id: string;
    nome: string;
    data_nascimento: string | null;
    observacoes: string | null;
    turma: {
      id: string;
      nome_turma: string;
      turno: string;
      moderador: {
        id: string;
        nome: string;
        email: string;
      };
    };
  };
  avaliacoes: {
    id: string;
    mes_referencia: number;
    ano_referencia: number;
    score_total: number;
    status: string;
    scores: Record<DominioKey, number>;
  }[];
  mediasDominios: { dominio: string; media: number }[];
}

export async function getAlunoDetalhes(alunoId: string): Promise<AlunoDetalhes | null> {
  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: {
      turma: {
        include: {
          moderador: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      },
      avaliacoes: {
        orderBy: { data_aplicacao: 'asc' },
        select: {
          id: true,
          mes_referencia: true,
          ano_referencia: true,
          score_total: true,
          status: true,
          score_fluencia_0a10: true,
          score_cultura_0a10: true,
          score_interpretacao_0a10: true,
          score_atencao_0a10: true,
          score_auto_percepcao_0a10: true,
        },
      },
    },
  });

  if (!aluno) return null;

  const avaliacoes = aluno.avaliacoes.map((avaliacao) => ({
    id: avaliacao.id,
    mes_referencia: avaliacao.mes_referencia,
    ano_referencia: avaliacao.ano_referencia,
    score_total: avaliacao.score_total,
    status: avaliacao.status,
    scores: {
      score_fluencia_0a10: avaliacao.score_fluencia_0a10,
      score_cultura_0a10: avaliacao.score_cultura_0a10,
      score_interpretacao_0a10: avaliacao.score_interpretacao_0a10,
      score_atencao_0a10: avaliacao.score_atencao_0a10,
      score_auto_percepcao_0a10: avaliacao.score_auto_percepcao_0a10,
    },
  }));

  const mediasDominios = (Object.keys(dominioLabels) as DominioKey[]).map((key) => {
    const soma = avaliacoes.reduce((total, avaliacao) => total + (avaliacao.scores[key] || 0), 0);
    const media = avaliacoes.length ? soma / avaliacoes.length : 0;
    return {
      dominio: dominioLabels[key],
      media,
    };
  });

  return {
    aluno: {
      id: aluno.id,
      nome: aluno.nome,
      data_nascimento: aluno.data_nascimento ? aluno.data_nascimento.toISOString() : null,
      observacoes: aluno.observacoes ?? null,
      turma: {
        id: aluno.turma.id,
        nome_turma: aluno.turma.nome_turma,
        turno: aluno.turma.turno,
        moderador: aluno.turma.moderador,
      },
    },
    avaliacoes,
    mediasDominios,
  };
}

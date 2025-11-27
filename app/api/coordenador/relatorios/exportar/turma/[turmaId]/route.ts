import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { format } from 'date-fns';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ turmaId: string }> }
) {
  try {
    const { turmaId } = await params;

    const user = await getUserFromToken();
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        moderador: true,
        alunos: {
          include: {
            avaliacoes: {
              where: { status: 'CONCLUIDA' },
              orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
            },
            presencas: true,
            eventos: true,
          },
        },
      },
    });

    if (!turma) {
      return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
    }

    const headers = [
      'ID_aluno',
      'Nome_aluno',
      'Data_avaliacao',
      'Mes',
      'Ano',
      'Idade',
      'Turma',
      'Moderador',
      'Score_Fluencia',
      'Score_Cultura',
      'Score_Interpretacao',
      'Score_Atencao',
      'Score_Auto_percepcao',
      'Score_Total',
      'Score_Fluencia_0a10',
      'Score_Cultura_0a10',
      'Score_Interpretacao_0a10',
      'Score_Atencao_0a10',
      'Score_Auto_percepcao_0a10',
      'Presencas_no_mes',
      'Eventos_relevantes',
    ];

    const rows: (string | number)[][] = [];

    for (const aluno of turma.alunos) {
      const presencasPorMes: Record<string, number> = {};
      aluno.presencas.forEach((p: typeof aluno.presencas[0]) => {
        if (p.presente) {
          const key = `${p.data.getMonth() + 1}/${p.data.getFullYear()}`;
          presencasPorMes[key] = (presencasPorMes[key] || 0) + 1;
        }
      });

      const eventosPorMes: Record<string, string[]> = {};
      aluno.eventos.forEach((e: typeof aluno.eventos[0]) => {
        const key = `${e.data.getMonth() + 1}/${e.data.getFullYear()}`;
        if (!eventosPorMes[key]) eventosPorMes[key] = [];
        eventosPorMes[key].push(e.titulo);
      });

      const idade = aluno.data_nascimento 
        ? Math.floor((Date.now() - new Date(aluno.data_nascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : '';

      for (const av of aluno.avaliacoes) {
        const mesAnoKey = `${av.mes_referencia}/${av.ano_referencia}`;
        rows.push([
          aluno.id,
          aluno.nome,
          format(av.data_aplicacao, 'dd/MM/yyyy'),
          av.mes_referencia,
          av.ano_referencia,
          idade,
          turma.nome_turma,
          turma.moderador.nome,
          av.score_fluencia.toFixed(2),
          av.score_cultura.toFixed(2),
          av.score_interpretacao.toFixed(2),
          av.score_atencao.toFixed(2),
          av.score_auto_percepcao.toFixed(2),
          av.score_total.toFixed(2),
          av.score_fluencia_0a10.toFixed(2),
          av.score_cultura_0a10.toFixed(2),
          av.score_interpretacao_0a10.toFixed(2),
          av.score_atencao_0a10.toFixed(2),
          av.score_auto_percepcao_0a10.toFixed(2),
          presencasPorMes[mesAnoKey] || 0,
          (eventosPorMes[mesAnoKey] || []).join('; '),
        ]);
      }
    }

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const filename = `metis_turma_${turma.nome_turma.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao exportar CSV da turma:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

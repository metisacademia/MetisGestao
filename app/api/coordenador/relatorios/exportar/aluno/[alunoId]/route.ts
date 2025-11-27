import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { format } from 'date-fns';

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
      include: {
        turma: {
          include: { moderador: true },
        },
      },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const avaliacoes = await prisma.avaliacao.findMany({
      where: { alunoId, status: 'CONCLUIDA' },
      orderBy: [{ ano_referencia: 'asc' }, { mes_referencia: 'asc' }],
    });

    const presencas = await prisma.presenca.findMany({
      where: { alunoId },
    });

    const presencasPorMes: Record<string, number> = {};
    presencas.forEach((p) => {
      if (p.presente) {
        const key = `${p.data.getMonth() + 1}/${p.data.getFullYear()}`;
        presencasPorMes[key] = (presencasPorMes[key] || 0) + 1;
      }
    });

    const eventos = await prisma.eventoAluno.findMany({
      where: { alunoId },
    });

    const eventosPorMes: Record<string, string[]> = {};
    eventos.forEach((e) => {
      const key = `${e.data.getMonth() + 1}/${e.data.getFullYear()}`;
      if (!eventosPorMes[key]) eventosPorMes[key] = [];
      eventosPorMes[key].push(e.titulo);
    });

    const idade = aluno.data_nascimento 
      ? Math.floor((Date.now() - new Date(aluno.data_nascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : '';

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

    const rows = avaliacoes.map((av) => {
      const mesAnoKey = `${av.mes_referencia}/${av.ano_referencia}`;
      return [
        aluno.id,
        aluno.nome,
        format(av.data_aplicacao, 'dd/MM/yyyy'),
        av.mes_referencia,
        av.ano_referencia,
        idade,
        aluno.turma.nome_turma,
        aluno.turma.moderador.nome,
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
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const filename = `metis_aluno_${aluno.nome.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

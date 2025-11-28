import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || '');
    const ano = parseInt(searchParams.get('ano') || '');

    if (!mes || !ano) {
      return NextResponse.json({ error: 'Mês e Ano são obrigatórios' }, { status: 400 });
    }

    // Buscar todas as turmas
    const turmas = await prisma.turma.findMany({
      include: {
        _count: {
          select: { alunos: true },
        },
        moderador: {
          select: { nome: true },
        },
      },
      orderBy: { nome_turma: 'asc' },
    });

    // Para cada turma, contar quantas avaliações existem no mês/ano
    const progresso = await Promise.all(
      turmas.map(async (turma) => {
        const avaliacoesCount = await prisma.avaliacao.count({
          where: {
            turmaId: turma.id,
            mes_referencia: mes,
            ano_referencia: ano,
            // Consideramos avaliada se existir registro (mesmo rascunho? O requisito diz "avaliados", 
            // geralmente implica concluída, mas para "pendente" vs "avaliado" na lista, 
            // o user pediu "Avaliado" se já tiver avaliação lançada.
            // Vamos considerar qualquer avaliação existente como "iniciada/avaliada" 
            // ou filtrar por status se o requisito for estrito.
            // O requisito 2.1 diz "Quantos alunos já avaliados". 
            // O requisito 2.2 diz status "Avaliado" se já tiver avaliação lançada.
            // Vou contar todas por enquanto, ou filtrar por status != null.
          },
        });

        const totalAlunos = turma._count.alunos;
        const percentual = totalAlunos > 0 ? (avaliacoesCount / totalAlunos) * 100 : 0;

        let status: 'VERDE' | 'AMARELO' | 'VERMELHO' = 'VERMELHO';
        if (percentual >= 100) status = 'VERDE';
        else if (percentual >= 50) status = 'AMARELO';

        return {
          id: turma.id,
          nome: turma.nome_turma,
          totalAlunos,
          avaliados: avaliacoesCount,
          pendentes: Math.max(0, totalAlunos - avaliacoesCount),
          percentual: Math.round(percentual),
          status,
          moderador: turma.moderador.nome,
          info: `${turma.dia_semana} • ${turma.horario} • ${turma.turno}`,
        };
      })
    );

    return NextResponse.json(progresso);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar progresso das avaliações' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { templateId, turmaId } = await request.json();

    if (!templateId) {
      return NextResponse.json({ error: 'templateId é obrigatório' }, { status: 400 });
    }

    const template = await prisma.templateAvaliacao.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template não encontrado' }, { status: 404 });
    }

    const turmas = turmaId 
      ? await prisma.turma.findMany({
          where: { id: turmaId },
          include: { alunos: true },
        })
      : await prisma.turma.findMany({
          include: { alunos: true },
        });

    if (turmas.length === 0) {
      return NextResponse.json({ error: 'Nenhuma turma encontrada' }, { status: 404 });
    }

    let avaliacoesCriadas = 0;
    let avaliacoesExistentes = 0;

    for (const turma of turmas) {
      for (const aluno of turma.alunos) {
        const avaliacaoExistente = await prisma.avaliacao.findFirst({
          where: {
            alunoId: aluno.id,
            mes_referencia: template.mes_referencia,
            ano_referencia: template.ano_referencia,
          },
        });

        if (avaliacaoExistente) {
          avaliacoesExistentes++;
          continue;
        }

        await prisma.avaliacao.create({
          data: {
            alunoId: aluno.id,
            turmaId: turma.id,
            templateId: template.id,
            mes_referencia: template.mes_referencia,
            ano_referencia: template.ano_referencia,
            status: 'RASCUNHO',
            data_aplicacao: new Date(),
          },
        });

        avaliacoesCriadas++;
      }
    }

    return NextResponse.json({
      success: true,
      avaliacoesCriadas,
      avaliacoesExistentes,
      totalAlunos: turmas.reduce((acc: any, t: any) => acc + t.alunos.length, 0),
      turmasProcessadas: turmas.length,
    });
  } catch (error) {
    console.error('Erro ao gerar avaliações:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar avaliações' },
      { status: 500 }
    );
  }
}

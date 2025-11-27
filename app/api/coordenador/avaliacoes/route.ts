import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mes = searchParams.get('mes');
    const ano = searchParams.get('ano');
    const turmaId = searchParams.get('turmaId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (mes) where.mes_referencia = Number(mes);
    if (ano) where.ano_referencia = Number(ano);
    if (turmaId) where.turmaId = turmaId;
    if (status) where.status = status;

    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      include: {
        aluno: {
          include: { turma: true },
        },
        template: true,
      },
      orderBy: [{ ano_referencia: 'desc' }, { mes_referencia: 'desc' }],
    });

    return NextResponse.json(avaliacoes);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { alunoId, templateId, mes_referencia, ano_referencia } = await request.json();

    if (!alunoId || !templateId || !mes_referencia || !ano_referencia) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const avaliacaoExistente = await prisma.avaliacao.findFirst({
      where: {
        alunoId,
        mes_referencia,
        ano_referencia,
      },
    });

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Já existe uma avaliação para este aluno neste período' },
        { status: 400 }
      );
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        alunoId,
        turmaId: aluno.turmaId,
        templateId,
        mes_referencia,
        ano_referencia,
        status: 'RASCUNHO',
        data_aplicacao: new Date(),
      },
      include: {
        aluno: true,
        template: true,
      },
    });

    return NextResponse.json(avaliacao);
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar avaliação' },
      { status: 500 }
    );
  }
}

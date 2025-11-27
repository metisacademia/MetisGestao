import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: alunoId } = await params;

    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findFirst({
      where: {
        id: alunoId,
        turma: { moderadorId: user.userId },
      },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const presencas = await prisma.presenca.findMany({
      where: { alunoId },
      orderBy: { data: 'desc' },
    });

    return NextResponse.json(presencas);
  } catch (error) {
    console.error('Erro ao buscar presenças:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: alunoId } = await params;

    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findFirst({
      where: {
        id: alunoId,
        turma: { moderadorId: user.userId },
      },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { data, presente, observacao } = body;

    if (!data) {
      return NextResponse.json({ error: 'Data é obrigatória' }, { status: 400 });
    }

    const dataPresenca = new Date(data);
    dataPresenca.setHours(12, 0, 0, 0);

    const presenca = await prisma.presenca.upsert({
      where: {
        alunoId_data: {
          alunoId,
          data: dataPresenca,
        },
      },
      create: {
        alunoId,
        data: dataPresenca,
        presente: presente !== false,
        observacao,
      },
      update: {
        presente: presente !== false,
        observacao,
      },
    });

    return NextResponse.json(presenca, { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar presença:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

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
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const eventos = await prisma.eventoAluno.findMany({
      where: { alunoId },
      orderBy: { data: 'desc' },
    });

    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
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
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { data, titulo, descricao, tipo } = body;

    if (!data || !titulo) {
      return NextResponse.json({ error: 'Data e título são obrigatórios' }, { status: 400 });
    }

    const evento = await prisma.eventoAluno.create({
      data: {
        alunoId,
        data: new Date(data),
        titulo,
        descricao,
        tipo: tipo || 'OUTROS',
      },
    });

    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

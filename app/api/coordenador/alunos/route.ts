import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const alunos = await prisma.aluno.findMany({
      include: {
        turma: true,
      },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { nome, turmaId, data_nascimento, observacoes } = await request.json();

    if (!nome || !turmaId) {
      return NextResponse.json(
        { error: 'Nome e turma são obrigatórios' },
        { status: 400 }
      );
    }

    const aluno = await prisma.aluno.create({
      data: {
        nome,
        turmaId,
        ...(data_nascimento && { data_nascimento: new Date(data_nascimento) }),
        observacoes,
      },
      include: { turma: true },
    });

    return NextResponse.json(aluno);
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao criar aluno' },
      { status: 500 }
    );
  }
}

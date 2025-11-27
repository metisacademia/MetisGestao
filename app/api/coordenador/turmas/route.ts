import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const turmas = await prisma.turma.findMany({
      include: { moderador: true },
      orderBy: { nome_turma: 'asc' },
    });

    return NextResponse.json(turmas);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { nome_turma, dia_semana, horario, turno, moderadorId } = await request.json();

    if (!nome_turma || !dia_semana || !horario || !turno || !moderadorId) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const turma = await prisma.turma.create({
      data: {
        nome_turma,
        dia_semana,
        horario,
        turno,
        moderadorId,
      },
      include: { moderador: true },
    });

    return NextResponse.json(turma);
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao criar turma' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
    const { 
      nome_turma, 
      dia_semana, 
      horario, 
      turno, 
      moderadorId,
      capacidade_maxima,
      data_inicio,
      data_fim,
      status,
      local,
    } = await request.json();

    if (!nome_turma || !dia_semana || !horario || !turno || !moderadorId || !data_inicio) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome_turma, dia_semana, horario, turno, moderadorId, data_inicio' },
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
        capacidade_maxima: capacidade_maxima || null,
        data_inicio: data_inicio ? new Date(data_inicio) : new Date(),
        data_fim: data_fim ? new Date(data_fim) : null,
        status: status || 'ABERTA',
        local: local || null,
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

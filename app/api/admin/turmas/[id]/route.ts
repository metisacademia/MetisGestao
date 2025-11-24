import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nome_turma, dia_semana, horario, turno, moderadorId } = await request.json();

    const turma = await prisma.turma.update({
      where: { id: params.id },
      data: {
        ...(nome_turma && { nome_turma }),
        ...(dia_semana && { dia_semana }),
        ...(horario && { horario }),
        ...(turno && { turno }),
        ...(moderadorId && { moderadorId }),
      },
      include: { moderador: true },
    });

    return NextResponse.json(turma);
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar turma' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.turma.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar turma' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const turma = await prisma.turma.update({
      where: { id },
      data: {
        ...(nome_turma && { nome_turma }),
        ...(dia_semana && { dia_semana }),
        ...(horario && { horario }),
        ...(turno && { turno }),
        ...(moderadorId && { moderadorId }),
        ...(capacidade_maxima !== undefined && { capacidade_maxima: capacidade_maxima || null }),
        ...(data_inicio && { data_inicio: new Date(data_inicio) }),
        ...(data_fim !== undefined && { data_fim: data_fim ? new Date(data_fim) : null }),
        ...(status && { status }),
        ...(local !== undefined && { local: local || null }),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.turma.delete({
      where: { id },
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

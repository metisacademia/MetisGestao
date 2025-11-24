import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nome, turmaId, data_nascimento, observacoes } = await request.json();

    const aluno = await prisma.aluno.update({
      where: { id: params.id },
      data: {
        ...(nome && { nome }),
        ...(turmaId && { turmaId }),
        ...(data_nascimento && { data_nascimento: new Date(data_nascimento) }),
        ...('observacoes' in { observacoes } && { observacoes }),
      },
      include: { turma: true },
    });

    return NextResponse.json(aluno);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar aluno' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.aluno.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar aluno' },
      { status: 500 }
    );
  }
}

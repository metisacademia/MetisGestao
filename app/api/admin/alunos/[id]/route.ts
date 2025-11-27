import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: { 
        turma: true,
        usuario: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    return NextResponse.json(aluno);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aluno' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nome, turmaId, data_nascimento, observacoes } = await request.json();

    const aluno = await prisma.aluno.update({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.aluno.delete({
      where: { id },
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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const {
      codigo_item,
      titulo,
      descricao,
      tipo_resposta,
      dominioId,
      ordem,
      ativo,
    } = await request.json();

    const item = await prisma.itemTemplate.update({
      where: { id: itemId },
      data: {
        ...(codigo_item && { codigo_item }),
        ...(titulo && { titulo }),
        ...('descricao' in { descricao } && { descricao }),
        ...(tipo_resposta && { tipo_resposta }),
        ...(dominioId && { dominioId }),
        ...(ordem !== undefined && { ordem }),
        ...('ativo' in { ativo } && { ativo }),
      },
      include: { dominio: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    await prisma.itemTemplate.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar item' },
      { status: 500 }
    );
  }
}

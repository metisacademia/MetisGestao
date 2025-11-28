import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { templateId } = await params;
    const itens = await prisma.itemTemplate.findMany({
      where: { templateId },
      include: { dominio: true },
      orderBy: { ordem: 'asc' },
    });

    return NextResponse.json(itens);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { templateId } = await params;
    const {
      codigo_item,
      titulo,
      descricao,
      tipo_resposta,
      dominioId,
      ordem,
      ativo,
    } = await request.json();

    if (!codigo_item || !titulo || !tipo_resposta || !dominioId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const item = await prisma.itemTemplate.create({
      data: {
        codigo_item,
        titulo,
        descricao,
        tipo_resposta,
        dominioId,
        templateId,
        ordem: ordem || 0,
        ativo: ativo ?? true,
        regra_pontuacao: JSON.stringify({}),
      },
      include: { dominio: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Erro ao criar item:', error);
    return NextResponse.json(
      { error: 'Erro ao criar item' },
      { status: 500 }
    );
  }
}

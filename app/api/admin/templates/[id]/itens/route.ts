import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createItemSchema } from '@/lib/validations/schemas';
import { errorResponse } from '@/lib/api-errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const itens = await prisma.itemTemplate.findMany({
      where: { templateId },
      include: { dominio: true },
      orderBy: { ordem: 'asc' },
    });

    return NextResponse.json(itens);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return NextResponse.json({ error: 'Erro ao buscar itens do template' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = createItemSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse(validationResult.error);
    }

    const data = validationResult.data;

    // Check for duplicate codigo_item in this template
    const existingItem = await prisma.itemTemplate.findFirst({
      where: {
        templateId,
        codigo_item: data.codigo_item,
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: `Já existe um item com o código "${data.codigo_item}" neste template` },
        { status: 400 }
      );
    }

    // Create the item
    const item = await prisma.itemTemplate.create({
      data: {
        codigo_item: data.codigo_item,
        titulo: data.titulo,
        descricao: data.descricao,
        tipo_resposta: data.tipo_resposta,
        dominioId: data.dominioId,
        templateId,
        ordem: data.ordem,
        ativo: true,
        regra_pontuacao: data.regra_pontuacao,
        config_opcoes: data.config_opcoes,
      },
      include: { dominio: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar item:', error);

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Domínio cognitivo inválido ou não encontrado' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro ao criar item do template' },
      { status: 500 }
    );
  }
}

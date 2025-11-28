import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { itemIds } = await request.json();

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { error: 'Array de IDs de itens é obrigatório' },
        { status: 400 }
      );
    }

    // Atualizar ordem dos itens em uma transação
    await prisma.$transaction(
      itemIds.map((itemId, index) =>
        prisma.itemTemplate.update({
          where: { id: itemId },
          data: { ordem: index },
        })
      )
    );

    // Retornar itens atualizados
    const itensAtualizados = await prisma.itemTemplate.findMany({
      where: {
        templateId: params.templateId,
      },
      include: {
        dominio: true,
      },
      orderBy: { ordem: 'asc' },
    });

    return NextResponse.json(itensAtualizados);
  } catch (error) {
    console.error('Erro ao reordenar itens:', error);
    return NextResponse.json(
      { error: 'Erro ao reordenar itens' },
      { status: 500 }
    );
  }
}

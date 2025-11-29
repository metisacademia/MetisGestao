import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { ativo } = await request.json();

    if (typeof ativo !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo ativo deve ser boolean' },
        { status: 400 }
      );
    }

    const template = await prisma.templateAvaliacao.update({
      where: { id },
      data: { ativo },
      include: {
        _count: { select: { itens: true } },
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar template' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    // Try to delete the dominio
    await prisma.dominioCognitivo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao deletar domínio:', error);

    // Handle foreign key constraint errors
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      return NextResponse.json(
        {
          error:
            'Não é possível excluir este domínio porque ele já está sendo utilizado em templates ou avaliações.',
        },
        { status: 400 }
      );
    }

    // Handle "not found" errors
    if (error.code === 'P2025' || error.message?.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Domínio não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Erro ao deletar domínio' }, { status: 500 });
  }
}

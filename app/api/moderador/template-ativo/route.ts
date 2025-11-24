import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mes = Number(searchParams.get('mes'));
    const ano = Number(searchParams.get('ano'));

    const template = await prisma.templateAvaliacao.findFirst({
      where: {
        mes_referencia: mes,
        ano_referencia: ano,
        ativo: true,
      },
      include: {
        itens: {
          where: { ativo: true },
          include: {
            dominio: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Nenhum template ativo encontrado para este mês/ano' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

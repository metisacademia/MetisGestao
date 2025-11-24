import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { alunoId: string } }
) {
  try {
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'MODERADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mes = Number(searchParams.get('mes'));
    const ano = Number(searchParams.get('ano'));

    const avaliacao = await prisma.avaliacao.findFirst({
      where: {
        alunoId: params.alunoId,
        mes_referencia: mes,
        ano_referencia: ano,
      },
      include: {
        respostas: true,
      },
    });

    if (!avaliacao) {
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    return NextResponse.json(avaliacao);
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

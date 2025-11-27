import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const templates = await prisma.templateAvaliacao.findMany({
      include: {
        _count: { select: { itens: true } },
      },
      orderBy: [{ ano_referencia: 'desc' }, { mes_referencia: 'desc' }],
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { nome, mes_referencia, ano_referencia, ativo } = await request.json();

    if (!nome || !mes_referencia || !ano_referencia) {
      return NextResponse.json(
        { error: 'Nome, mês e ano são obrigatórios' },
        { status: 400 }
      );
    }

    const mesNum = parseInt(mes_referencia, 10);
    const anoNum = parseInt(ano_referencia, 10);

    if (mesNum < 1 || mesNum > 12) {
      return NextResponse.json(
        { error: 'Mês deve ser entre 1 e 12' },
        { status: 400 }
      );
    }

    if (anoNum < 2000 || anoNum > 2100) {
      return NextResponse.json(
        { error: 'Ano inválido' },
        { status: 400 }
      );
    }

    const template = await prisma.templateAvaliacao.create({
      data: {
        nome,
        mes_referencia: mesNum,
        ano_referencia: anoNum,
        ativo: ativo ?? true,
      },
      include: {
        _count: { select: { itens: true } },
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Erro ao criar template:', error);
    return NextResponse.json(
      { error: 'Erro ao criar template' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const template = await prisma.templateAvaliacao.findUnique({
      where: { id },
      include: {
        itens: {
          include: { dominio: true },
          orderBy: { ordem: 'asc' },
        },
        _count: { select: { itens: true } },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template não encontrado' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { nome, mes_referencia, ano_referencia, ativo } = await request.json();

    const updateData: Record<string, unknown> = {};

    if (nome !== undefined) updateData.nome = nome;
    if (mes_referencia !== undefined) {
      const mesNum = parseInt(mes_referencia, 10);
      if (mesNum < 1 || mesNum > 12) {
        return NextResponse.json({ error: 'Mês deve ser entre 1 e 12' }, { status: 400 });
      }
      updateData.mes_referencia = mesNum;
    }
    if (ano_referencia !== undefined) {
      const anoNum = parseInt(ano_referencia, 10);
      if (anoNum < 2000 || anoNum > 2100) {
        return NextResponse.json({ error: 'Ano inválido' }, { status: 400 });
      }
      updateData.ano_referencia = anoNum;
    }
    if (ativo !== undefined) updateData.ativo = ativo;

    const template = await prisma.templateAvaliacao.update({
      where: { id },
      data: updateData,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user || !['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.templateAvaliacao.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar template:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar template' },
      { status: 500 }
    );
  }
}

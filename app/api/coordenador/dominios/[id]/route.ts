import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = await params;
    const dominio = await prisma.dominioCognitivo.findUnique({
      where: { id },
    });

    if (!dominio) {
      return NextResponse.json({ error: 'Domínio não encontrado' }, { status: 404 });
    }

    return NextResponse.json(dominio);
  } catch (error) {
    console.error('Erro ao buscar domínio:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = await params;
    const { nome, descricao, pontuacao_maxima } = await request.json();

    const updateData: Record<string, unknown> = {};

    if (nome !== undefined) {
      if (nome.trim() === '') {
        return NextResponse.json({ error: 'Nome não pode ser vazio' }, { status: 400 });
      }
      updateData.nome = nome.trim();
    }

    if (descricao !== undefined) {
      updateData.descricao = descricao?.trim() || null;
    }

    if (pontuacao_maxima !== undefined) {
      const pontuacaoNum = parseFloat(pontuacao_maxima);
      if (isNaN(pontuacaoNum) || pontuacaoNum <= 0) {
        return NextResponse.json(
          { error: 'Pontuação máxima deve ser um número positivo' },
          { status: 400 }
        );
      }
      updateData.pontuacao_maxima = pontuacaoNum;
    }

    const dominio = await prisma.dominioCognitivo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(dominio);
  } catch (error) {
    console.error('Erro ao atualizar domínio:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar domínio' },
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
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!['ADMIN', 'COORDENADOR'].includes(user.perfil)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = await params;
    
    await prisma.dominioCognitivo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar domínio:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar domínio' },
      { status: 500 }
    );
  }
}

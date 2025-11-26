import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const dominios = await prisma.dominioCognitivo.findMany({
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(dominios);
  } catch (error) {
    console.error('Erro ao buscar domínios:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { nome, descricao, pontuacao_maxima } = await request.json();

    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (pontuacao_maxima === undefined || pontuacao_maxima === null) {
      return NextResponse.json(
        { error: 'Pontuação máxima é obrigatória' },
        { status: 400 }
      );
    }

    const pontuacaoNum = parseFloat(pontuacao_maxima);
    if (isNaN(pontuacaoNum) || pontuacaoNum <= 0) {
      return NextResponse.json(
        { error: 'Pontuação máxima deve ser um número positivo' },
        { status: 400 }
      );
    }

    const dominio = await prisma.dominioCognitivo.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        pontuacao_maxima: pontuacaoNum,
      },
    });

    return NextResponse.json(dominio);
  } catch (error) {
    console.error('Erro ao criar domínio:', error);
    return NextResponse.json(
      { error: 'Erro ao criar domínio' },
      { status: 500 }
    );
  }
}

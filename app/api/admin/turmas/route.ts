import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const turmas = await prisma.turma.findMany({
      orderBy: { nome_turma: 'asc' },
    });

    return NextResponse.json(turmas);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

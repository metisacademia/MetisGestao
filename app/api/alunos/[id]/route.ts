import { NextResponse } from 'next/server';
import { getAlunoDetalhes } from '@/lib/aluno-details';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const detalhes = await getAlunoDetalhes(id);

    if (!detalhes) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    return NextResponse.json(detalhes);
  } catch (error) {
    console.error('Erro ao carregar detalhes do aluno', error);
    return NextResponse.json({ error: 'Erro ao carregar aluno' }, { status: 500 });
  }
}

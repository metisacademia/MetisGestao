import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; templateId: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'COORDENADOR') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { templateId } = await params;

    // Buscar template original com todos os itens
    const templateOriginal = await prisma.templateAvaliacao.findUnique({
      where: { id: templateId },
      include: {
        itens: true,
      },
    });

    if (!templateOriginal) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      );
    }

    // Criar novo template com itens copiados
    const novoTemplate = await prisma.templateAvaliacao.create({
      data: {
        nome: `Cópia de ${templateOriginal.nome}`,
        mes_referencia: templateOriginal.mes_referencia,
        ano_referencia: templateOriginal.ano_referencia,
        ativo: false, // Novo template vem inativo
        observacoes: templateOriginal.observacoes,
        itens: {
          create: templateOriginal.itens.map((item) => ({
            dominioId: item.dominioId,
            codigo_item: item.codigo_item,
            titulo: item.titulo,
            descricao: item.descricao,
            tipo_resposta: item.tipo_resposta,
            ordem: item.ordem,
            config_opcoes: item.config_opcoes,
            regra_pontuacao: item.regra_pontuacao,
            ativo: item.ativo,
          })),
        },
      },
      include: {
        _count: { select: { itens: true } },
      },
    });

    return NextResponse.json(novoTemplate);
  } catch (error) {
    console.error('Erro ao duplicar template:', error);
    return NextResponse.json(
      { error: 'Erro ao duplicar template' },
      { status: 500 }
    );
  }
}

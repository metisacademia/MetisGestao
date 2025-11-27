import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { senhaAtual, novaSenha } = body;

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      );
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: user.userId },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha_hash);
    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 400 }
      );
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id: user.userId },
      data: { senha_hash: novaSenhaHash },
    });

    return NextResponse.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

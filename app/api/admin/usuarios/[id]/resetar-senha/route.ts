import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

function gerarSenhaAleatoria(tamanho: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return senha;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (usuario.perfil === 'ADMIN' && usuario.id !== user.userId) {
      return NextResponse.json(
        { error: 'Não é possível resetar a senha de outro administrador' },
        { status: 403 }
      );
    }

    const novaSenha = gerarSenhaAleatoria(8);
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id },
      data: { senha_hash: novaSenhaHash },
    });

    return NextResponse.json({
      success: true,
      novaSenha,
      message: 'Senha resetada com sucesso. Anote a nova senha, pois ela não será exibida novamente.',
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

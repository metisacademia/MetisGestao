import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken, hashPassword } from '@/lib/auth';

function generatePassword(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function getFirstName(nome: string): string {
  return nome.trim().split(' ')[0].toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken();
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!aluno) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    if (aluno.usuarioId) {
      return NextResponse.json(
        { error: 'Este aluno já possui um usuário cadastrado' },
        { status: 400 }
      );
    }

    const firstName = getFirstName(aluno.nome);
    let baseEmail = `${firstName}@metis`;
    let email = baseEmail;
    let suffix = 1;

    let existingUser = await prisma.usuario.findUnique({ where: { email } });
    while (existingUser) {
      suffix++;
      email = `${firstName}${suffix}@metis`;
      existingUser = await prisma.usuario.findUnique({ where: { email } });
    }

    const senha = generatePassword(6);
    const senha_hash = await hashPassword(senha);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: aluno.nome,
        email,
        senha_hash,
        perfil: 'ALUNO',
      },
    });

    await prisma.aluno.update({
      where: { id },
      data: { usuarioId: novoUsuario.id },
    });

    return NextResponse.json({
      email,
      senha,
      mensagem: 'Usuário criado com sucesso. Guarde a senha, ela será exibida apenas uma vez.',
    });
  } catch (error) {
    console.error('Erro ao criar usuário para aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}

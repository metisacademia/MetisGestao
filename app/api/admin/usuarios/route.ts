import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const usuarios = await prisma.usuario.findMany({
      orderBy: { criado_em: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        criado_em: true,
        aluno: {
          select: {
            id: true,
            nome: true,
          }
        }
      }
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.perfil !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { nome, email, senha, perfil, alunoId } = body;

    if (!nome || !email || !senha || !perfil) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['COORDENADOR', 'MODERADOR', 'ALUNO'].includes(perfil)) {
      return NextResponse.json(
        { error: 'Tipo de perfil inválido' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 400 }
      );
    }

    if (perfil === 'ALUNO') {
      if (!alunoId) {
        return NextResponse.json(
          { error: 'Para perfil ALUNO, é necessário vincular a um aluno cadastrado' },
          { status: 400 }
        );
      }

      const aluno = await prisma.aluno.findUnique({
        where: { id: alunoId },
        select: { usuarioId: true }
      });

      if (!aluno) {
        return NextResponse.json(
          { error: 'Aluno não encontrado' },
          { status: 404 }
        );
      }

      if (aluno.usuarioId) {
        return NextResponse.json(
          { error: 'Este aluno já possui uma conta de acesso' },
          { status: 400 }
        );
      }
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha_hash,
        perfil,
      },
    });

    if (perfil === 'ALUNO' && alunoId) {
      await prisma.aluno.update({
        where: { id: alunoId },
        data: { usuarioId: novoUsuario.id },
      });
    }

    return NextResponse.json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      perfil: novoUsuario.perfil,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';

import TurmaFilters from '@/components/avaliacoes/TurmaFilters';

export default async function AdminTurmaAvaliacoesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const { id } = await params;
  const { mes, ano } = await searchParams;

  // Validate ID format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/avaliacoes">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Erro: ID Inválido</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">ID de turma inválido</h3>
                <p className="text-muted-foreground mt-2">
                  O ID fornecido não é válido. Por favor, verifique o link e tente novamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  let turma;
  try {
    turma = await prisma.turma.findUnique({
      where: { id },
      include: {
        alunos: {
          orderBy: { nome: 'asc' },
        },
        moderador: {
          select: { nome: true },
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/avaliacoes">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Erro ao Carregar Turma</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">Erro ao carregar dados da turma</h3>
                <p className="text-muted-foreground mt-2">
                  Ocorreu um erro ao buscar os dados da turma no banco de dados.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {error instanceof Error ? error.message : 'Erro desconhecido'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!turma) {
    redirect('/admin/avaliacoes');
  }

  const mesAtual = mes ? parseInt(mes) : new Date().getMonth() + 1;
  const anoAtual = ano ? parseInt(ano) : new Date().getFullYear();

  const avaliacoesMesAtual = await prisma.avaliacao.groupBy({
    by: ['alunoId'],
    where: {
      turmaId: turma.id,
      mes_referencia: mesAtual,
      ano_referencia: anoAtual,
    },
  });

  const alunosComAvaliacao = new Set(avaliacoesMesAtual.map((a: any) => a.alunoId));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/avaliacoes">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{turma.nome_turma}</h1>
          <p className="text-muted-foreground mt-1">
            {turma.dia_semana} • {turma.horario} • {turma.turno}
          </p>
        </div>
      </div>

      <TurmaFilters />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Alunos da Turma</CardTitle>
              <CardDescription>
                Referência: {String(mesAtual).padStart(2, '0')}/{anoAtual} • Total: {turma.alunos.length} aluno(s)
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Moderador: {turma.moderador.nome}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status ({String(mesAtual).padStart(2, '0')}/{anoAtual})</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turma.alunos.map((aluno: any) => {
                const jaAvaliado = alunosComAvaliacao.has(aluno.id);
                return (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                          jaAvaliado
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {jaAvaliado ? 'Avaliado ✓' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant={jaAvaliado ? "outline" : "default"} size="sm">
                        <Link href={`/admin/avaliacoes/aluno/${aluno.id}?mes=${mesAtual}&ano=${anoAtual}&turmaId=${turma.id}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          {jaAvaliado ? 'Ver / Editar' : 'Avaliar'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {turma.alunos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Nenhum aluno cadastrado nesta turma.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

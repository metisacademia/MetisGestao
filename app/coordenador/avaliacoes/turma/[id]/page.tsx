import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

import TurmaFilters from '@/components/avaliacoes/TurmaFilters';

export default async function CoordenadorTurmaAvaliacoesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mes?: string; ano?: string }>;
}) {
  const { id } = await params;
  const { mes, ano } = await searchParams;
  
  const turma = await prisma.turma.findUnique({
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

  if (!turma) {
    redirect('/coordenador/avaliacoes');
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
          <Link href="/coordenador/avaliacoes">
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
                        <Link href={`/coordenador/avaliacoes/aluno/${aluno.id}?mes=${mesAtual}&ano=${anoAtual}&turmaId=${turma.id}`}>
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

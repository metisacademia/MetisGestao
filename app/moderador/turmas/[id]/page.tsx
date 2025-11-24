import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default async function TurmaDetalhePage({ params }: { params: { id: string } }) {
  const user = await getUserFromToken();

  const turma = await prisma.turma.findFirst({
    where: { 
      id: params.id,
      moderadorId: user!.userId,
    },
    include: {
      alunos: {
        orderBy: { nome: 'asc' },
      },
    },
  });

  if (!turma) {
    redirect('/moderador');
  }

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  const avaliacoesMesAtual = await prisma.avaliacao.groupBy({
    by: ['alunoId'],
    where: {
      turmaId: turma.id,
      mes_referencia: mesAtual,
      ano_referencia: anoAtual,
    },
  });

  const alunosComAvaliacao = new Set(avaliacoesMesAtual.map(a => a.alunoId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{turma.nome_turma}</h1>
        <p className="text-muted-foreground mt-2">
          {turma.dia_semana} • {turma.horario} • {turma.turno}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alunos da Turma</CardTitle>
          <CardDescription>
            Total: {turma.alunos.length} aluno(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status (Mês Atual)</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turma.alunos.map((aluno) => {
                const jaAvaliado = alunosComAvaliacao.has(aluno.id);
                return (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          jaAvaliado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {jaAvaliado ? 'Avaliado' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/moderador/avaliar/${aluno.id}?mes=${mesAtual}&ano=${anoAtual}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          {jaAvaliado ? 'Ver Avaliação' : 'Lançar Avaliação'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

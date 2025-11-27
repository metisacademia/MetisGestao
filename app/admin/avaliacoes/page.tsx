import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default async function AdminAvaliacoesPage() {
  const turmas = await prisma.turma.findMany({
    include: {
      _count: { select: { alunos: true } },
      moderador: {
        select: { nome: true },
      },
    },
    orderBy: { nome_turma: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Selecione uma turma para lançar avaliações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turmas.map((turma: any) => (
          <Card key={turma.id}>
            <CardHeader>
              <CardTitle>{turma.nome_turma}</CardTitle>
              <CardDescription>
                {turma.dia_semana} • {turma.horario} • {turma.turno}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{turma._count.alunos} aluno(s)</span>
                </div>
                <p>Moderador: {turma.moderador.nome}</p>
              </div>
              <Button asChild className="w-full">
                <Link href={`/admin/avaliacoes/turma/${turma.id}`}>
                  Ver Alunos
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {turmas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma turma cadastrada ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
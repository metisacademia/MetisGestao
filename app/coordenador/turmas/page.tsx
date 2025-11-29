import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TurmasContent from './content';

export default async function TurmasPage() {
  try {
    const turmasRaw = await prisma.turma.findMany({
      include: {
        moderador: true,
        _count: { select: { alunos: true } },
      },
      orderBy: { nome_turma: 'asc' },
    });

    // Convert dates to strings for client component
    const turmas = turmasRaw.map(turma => ({
      ...turma,
      data_inicio: turma.data_inicio ? turma.data_inicio.toISOString() : new Date().toISOString(),
      data_fim: turma.data_fim ? turma.data_fim.toISOString() : null,
    }));

    const moderadores = await prisma.usuario.findMany({
      where: { perfil: 'MODERADOR' },
      select: { id: true, nome: true },
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Turmas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as turmas da academia
          </p>
        </div>

        <TurmasContent turmasIniciais={turmas} moderadores={moderadores} />
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar turmas:', error);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Turmas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as turmas da academia
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">Erro ao carregar turmas</h3>
                <p className="text-muted-foreground mt-2">
                  Ocorreu um erro ao buscar as turmas do banco de dados.
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
}

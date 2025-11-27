import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TurmasContent from './content';

export default async function TurmasPage() {
  const turmas = await prisma.turma.findMany({
    include: {
      moderador: true,
      _count: { select: { alunos: true } },
    },
    orderBy: { nome_turma: 'asc' },
  });

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
}

import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TurmasContent from './content';
import { verifyAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function ModeradorTurmasPage() {
  // Get authenticated user
  const headersList = headers();
  const auth = await verifyAuth(headersList as any);
  
  if (!auth?.id) {
    return <div>Não autorizado</div>;
  }

  // Moderator can only see their own turmas
  const turmas = await prisma.turma.findMany({
    where: {
      moderadorId: auth.id,
    },
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
        <h1 className="text-3xl font-bold">Minhas Turmas</h1>
        <p className="text-muted-foreground mt-2">
          Turmas sob sua moderação
        </p>
      </div>

      <TurmasContent turmasIniciais={turmas} moderadores={moderadores} />
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function TurmasPage() {
  const turmas = await prisma.turma.findMany({
    include: {
      moderador: true,
      _count: { select: { alunos: true } },
    },
    orderBy: { nome_turma: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Turmas</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as turmas da academia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Turmas</CardTitle>
          <CardDescription>
            Total: {turmas.length} turma(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Turma</TableHead>
                <TableHead>Dia/Horário</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Moderador</TableHead>
                <TableHead>Alunos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmas.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell className="font-medium">{turma.nome_turma}</TableCell>
                  <TableCell>
                    {turma.dia_semana} às {turma.horario}
                  </TableCell>
                  <TableCell>{turma.turno}</TableCell>
                  <TableCell>{turma.moderador.nome}</TableCell>
                  <TableCell>{turma._count.alunos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

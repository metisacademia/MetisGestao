import { prisma } from '@/lib/prisma';
import AlunosContent from './content';

export default async function AlunosPage() {
  const alunos = await prisma.aluno.findMany({
    select: {
      id: true,
      nome: true,
      turmaId: true,
      data_nascimento: true,
      observacoes: true,
      turma: {
        select: {
          id: true,
          nome_turma: true,
        },
      },
    },
    orderBy: { nome: 'asc' },
  });

  const turmas = await prisma.turma.findMany({
    select: { id: true, nome_turma: true },
    orderBy: { nome_turma: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alunos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os alunos cadastrados
        </p>
      </div>

      <AlunosContent alunosIniciais={alunos} turmas={turmas} />
    </div>
  );
}

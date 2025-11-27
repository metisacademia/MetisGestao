import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserCircle, FileText } from 'lucide-react';

export default async function CoordenadorDashboard() {
  const [totalUsuarios, totalTurmas, totalAlunos, totalTemplates] = await Promise.all([
    prisma.usuario.count(),
    prisma.turma.count(),
    prisma.aluno.count(),
    prisma.templateAvaliacao.count(),
  ]);

  const stats = [
    {
      title: 'Usuários',
      value: totalUsuarios,
      description: 'Total de usuários no sistema',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Turmas',
      value: totalTurmas,
      description: 'Turmas cadastradas',
      icon: GraduationCap,
      color: 'text-green-600',
    },
    {
      title: 'Alunos',
      value: totalAlunos,
      description: 'Alunos matriculados',
      icon: UserCircle,
      color: 'text-purple-600',
    },
    {
      title: 'Templates',
      value: totalTemplates,
      description: 'Templates de avaliação',
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do sistema de avaliações cognitivas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

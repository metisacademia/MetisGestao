'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileCheck, AlertCircle, BarChart3 } from 'lucide-react';

interface Estatisticas {
  media_geral: number;
  mediana: number;
  total_avaliacoes: number;
  alunos_sem_avaliacao: number;
}

interface CardsEstatisticasTurmaProps {
  dados: Estatisticas;
  totalAlunos: number;
}

export function CardsEstatisticasTurma({ dados, totalAlunos }: CardsEstatisticasTurmaProps) {
  const cards = [
    {
      title: 'Média Geral',
      value: dados.media_geral.toFixed(2),
      icon: TrendingUp,
      color: 'text-[#173b5a]',
      bgColor: 'bg-[#173b5a]/10'
    },
    {
      title: 'Total de Avaliações',
      value: dados.total_avaliacoes,
      subtitle: `de ${totalAlunos} alunos`,
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Alunos sem Avaliação',
      value: dados.alunos_sem_avaliacao,
      icon: AlertCircle,
      color: dados.alunos_sem_avaliacao > 0 ? 'text-amber-600' : 'text-gray-500',
      bgColor: dados.alunos_sem_avaliacao > 0 ? 'bg-amber-50' : 'bg-gray-50'
    },
    {
      title: 'Mediana',
      value: dados.mediana.toFixed(2),
      icon: BarChart3,
      color: 'text-[#cda465]',
      bgColor: 'bg-[#cda465]/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

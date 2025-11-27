'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Brain, BookOpen, Search, Eye, User } from 'lucide-react';

interface DadosResumo {
  dominio: string;
  atual: number;
  anterior: number;
  variacao: number;
  tendencia: 'melhora' | 'estavel' | 'queda';
}

interface CardsResumoProps {
  dados: DadosResumo[];
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Total': Brain,
  'Fluência': BookOpen,
  'Cultura': BookOpen,
  'Interpretação': Search,
  'Atenção': Eye,
  'Auto-percepção': User,
};

const CORES_TENDENCIA = {
  melhora: { bg: 'bg-green-50', text: 'text-green-700', icon: TrendingUp },
  estavel: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Minus },
  queda: { bg: 'bg-red-50', text: 'text-red-700', icon: TrendingDown },
};

export function CardsResumo({ dados }: CardsResumoProps) {
  if (!dados || dados.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Visão Rápida</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dados.map((item) => {
          const Icon = ICONS[item.dominio] || Brain;
          const tendencia = CORES_TENDENCIA[item.tendencia];
          const TendenciaIcon = tendencia.icon;

          return (
            <Card key={item.dominio} className={`${tendencia.bg} border-0`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-[#173b5a]" />
                  <div className={`flex items-center gap-1 ${tendencia.text}`}>
                    <TendenciaIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {item.variacao > 0 ? '+' : ''}{item.variacao.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#173b5a]">
                  {item.atual.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.dominio}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Comparação com 6 meses atrás ou primeira avaliação
      </p>
    </div>
  );
}

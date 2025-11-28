'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, History, Calendar } from 'lucide-react';

interface HistoricoItem {
  id: string;
  mes_referencia: number;
  ano_referencia: number;
  score_total: number;
  data_aplicacao: string;
}

interface HistoricoAvaliacoesProps {
  alunoId: string;
}

export default function HistoricoAvaliacoes({ alunoId }: HistoricoAvaliacoesProps) {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await fetch(`/api/avaliacoes/historico?alunoId=${alunoId}`);
        if (res.ok) {
          const data = await res.json();
          setHistorico(data);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    }

    if (alunoId) {
      fetchHistorico();
    }
  }, [alunoId]);

  if (loading) return null; // Não mostra nada enquanto carrega para não poluir a tela
  if (historico.length === 0) return null; // Não mostra se não tiver histórico

  return (
    <Card className="bg-muted/30 border-dashed mb-6">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <History className="w-4 h-4" />
          Últimas Avaliações
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3 px-4">
        <div className="flex flex-wrap gap-4">
          {historico.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 bg-background border rounded-md px-3 py-2 text-sm shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {String(item.mes_referencia).padStart(2, '0')}/{item.ano_referencia}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="font-semibold text-primary">
                Score: {item.score_total.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

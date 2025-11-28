'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiltroPeriodo, type Periodo } from '@/components/relatorios/filtro-periodo';
import { GraficoBarrasComparativo } from '@/components/relatorios/grafico-barras-comparativo';
import { TabelaRanking } from '@/components/relatorios/tabela-ranking';
import { CardsEstatisticasTurma } from '@/components/relatorios/cards-estatisticas-turma';
import { GraficoRadar } from '@/components/graficos/grafico-radar';
import { Loader2, AlertCircle, ArrowLeft, Download, FileText } from 'lucide-react';
import { exportToCSV, generateCSVFilename } from '@/lib/csv-utils';

interface DadosComparacao {
  alunoId: string;
  nome: string;
  score_total: number | null;
  temAvaliacao: boolean;
  posicao: number | null;
}

interface DadosRadar {
  dominio: string;
  aluno: number;
}

interface Estatisticas {
  media_geral: number;
  mediana: number;
  total_avaliacoes: number;
  alunos_sem_avaliacao: number;
}

interface DadosTurma {
  turma: {
    id: string;
    nome_turma: string;
    moderador: { id: string; nome: string };
    dia_semana: string;
    horario: string;
    turno: string;
    total_alunos: number;
  };
  comparacao: DadosComparacao[];
  radarTurma: DadosRadar[];
  estatisticas: Estatisticas;
}

export default function RelatorioTurmaPage() {
  const params = useParams();
  const router = useRouter();
  const turmaId = params.turmaId as string;

  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<DadosTurma | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('1m');

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/relatorios/turma/${turmaId}?periodo=${periodo}`);
        if (res.ok) {
          const data = await res.json();
          setDados(data);
        } else {
          console.error('Erro ao carregar dados da turma');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [turmaId, periodo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Erro ao carregar dados</p>
            <p className="text-muted-foreground mt-2">
              Não foi possível carregar os dados da turma.
            </p>
            <Button onClick={() => router.back()} className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!dados) return;

    const periodLabels = {
      '1m': 'ultimo_mes',
      '3m': 'ultimos_3_meses',
      '6m': 'ultimos_6_meses',
      '1y': 'ultimo_ano',
    };

    const csvData = dados.comparacao.map(item => ({
      posicao: item.posicao || '-',
      nome: item.nome,
      score_total: item.score_total !== null ? item.score_total.toFixed(2) : '-',
      tem_avaliacao: item.temAvaliacao ? 'Sim' : 'Não',
    }));

    const headers = {
      posicao: 'Posição',
      nome: 'Nome do Aluno',
      score_total: 'Score Total',
      tem_avaliacao: 'Tem Avaliação',
    };

    const filename = `relatorio_turma_${dados.turma.nome_turma.replace(/\s+/g, '_')}_${periodLabels[periodo]}_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(csvData, filename, headers);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Relatório da Turma - {dados.turma.nome_turma}</h1>
          <p className="text-muted-foreground mt-2">
            Moderador: {dados.turma.moderador.nome} | {dados.turma.dia_semana} | {dados.turma.horario}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <FileText className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-6 items-end">
            <FiltroPeriodo value={periodo} onChange={setPeriodo} />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <CardsEstatisticasTurma
        dados={dados.estatisticas}
        totalAlunos={dados.turma.total_alunos}
      />

      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Desempenho</CardTitle>
          <CardDescription>
            Score total dos alunos no período selecionado.
            Barras cinzas tracejadas indicam ausência de avaliação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dados.comparacao.length > 0 ? (
            <GraficoBarrasComparativo dados={dados.comparacao} />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Nenhuma avaliação encontrada no período selecionado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking</CardTitle>
          <CardDescription>
            Classificação dos alunos por desempenho no período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabelaRanking dados={dados.comparacao} />
        </CardContent>
      </Card>

      {/* Class Radar Chart */}
      {dados.radarTurma.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perfil da Turma por Domínio Cognitivo</CardTitle>
            <CardDescription>
              Média da turma em cada domínio cognitivo no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoRadar
              dados={dados.radarTurma.map((d) => ({ dominio: d.dominio, aluno: d.media }))}
              mostrarMedia={false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

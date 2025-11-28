'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GraficoEvolucaoAvancado } from '@/components/relatorios/grafico-evolucao-avancado';
import { GraficoRadar } from '@/components/graficos/grafico-radar';
import { GraficoBarras } from '@/components/graficos/grafico-barras';
import { GraficoPresenca } from '@/components/relatorios/grafico-presenca';
import { FiltroPeriodo, type Periodo } from '@/components/relatorios/filtro-periodo';
import { ToggleMetricas, type MetricasVisiveis } from '@/components/relatorios/toggle-metricas';
import { CardsResumo } from '@/components/relatorios/cards-resumo';
import { LinhaTempoEventos } from '@/components/relatorios/linha-tempo-eventos';
import { ResumoAnalitico } from '@/components/relatorios/resumo-analitico';
import { Loader2, AlertCircle, Download, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface Aluno {
  id: string;
  nome: string;
  turma?: {
    id: string;
    nome_turma: string;
  };
}

interface Turma {
  id: string;
  nome_turma: string;
}

interface DadosCompletos {
  aluno: { id: string; nome: string; turma: string };
  evolucao: Array<{
    mes_ano: string;
    score_total: number;
    score_fluencia: number;
    score_cultura: number;
    score_interpretacao: number;
    score_atencao: number;
    score_auto_percepcao: number;
    media_movel?: number;
    evento?: { titulo: string; tipo: string };
  }>;
  radar: Array<{ dominio: string; aluno: number; media?: number }>;
  temMediaTurma: boolean;
  cardsResumo: Array<{
    dominio: string;
    atual: number;
    anterior: number;
    variacao: number;
    tendencia: 'melhora' | 'estavel' | 'queda';
  }>;
  presenca: {
    dados: Array<{ mes_ano: string; presencas: number; total_sessoes: number; percentual: number }>;
    mesAtual: { presencas: number; total: number };
    media6Meses: number;
  };
  eventos: Array<{ id: string; data: string; titulo: string; descricao?: string; tipo: 'SAUDE' | 'ROTINA' | 'TURMA' | 'OUTROS' }>;
  resumoTexto: string;
}

const METRICAS_INICIAIS: MetricasVisiveis = {
  total: true,
  fluencia: true,
  cultura: true,
  interpretacao: true,
  atencao: true,
  auto_percepcao: true,
  media_movel: false,
};

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [loadingDados, setLoadingDados] = useState(false);
  const [loadingTurma, setLoadingTurma] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState('all');
  const [selectedTurma, setSelectedTurma] = useState('all');
  const [periodo, setPeriodo] = useState<Periodo>('6m');
  const [metricas, setMetricas] = useState<MetricasVisiveis>(METRICAS_INICIAIS);
  const [dados, setDados] = useState<DadosCompletos | null>(null);
  const [dadosComparacao, setDadosComparacao] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [turmasRes, alunosRes] = await Promise.all([
          fetch('/api/coordenador/turmas'),
          fetch('/api/coordenador/alunos'),
        ]);

        const turmasData = await turmasRes.json();
        const alunosData = await alunosRes.json();

        setTurmas(turmasData);
        setAlunos(alunosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    async function carregarDadosAluno() {
      if (selectedAluno === 'all') {
        setDados(null);
        return;
      }
      setLoadingDados(true);
      try {
        const res = await fetch(`/api/coordenador/relatorios/aluno/${selectedAluno}/completo?periodo=${periodo}`);
        if (res.ok) {
          const data = await res.json();
          setDados(data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoadingDados(false);
      }
    }
    carregarDadosAluno();
  }, [selectedAluno, periodo]);

  useEffect(() => {
    async function carregarDadosTurma() {
      if (selectedTurma === 'all') {
        setDadosComparacao([]);
        return;
      }
      setLoadingTurma(true);
      try {
        const mesAtual = new Date().getMonth() + 1;
        const anoAtual = new Date().getFullYear();
        const res = await fetch(
          `/api/coordenador/relatorios/turma/${selectedTurma}?mes=${mesAtual}&ano=${anoAtual}`
        );
        if (res.ok) {
          const data = await res.json();
          setDadosComparacao(data.comparacao || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da turma:', error);
      } finally {
        setLoadingTurma(false);
      }
    }
    carregarDadosTurma();
  }, [selectedTurma]);

  const alunoSelecionado = useMemo(() => {
    if (selectedAluno === 'all') return undefined;
    return alunos.find((a) => a.id === selectedAluno);
  }, [alunos, selectedAluno]);

  const handleExportarCSV = () => {
    if (selectedAluno && selectedAluno !== 'all') {
      window.open(`/api/coordenador/relatorios/exportar/aluno/${selectedAluno}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Análise de desempenho e evolução dos alunos
          </p>
        </div>
        {selectedAluno && selectedAluno !== 'all' && dados && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportarCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Link href={`/coordenador/relatorios/anual/${selectedAluno}`}>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Relatório Anual
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6 items-end">
            <div className="space-y-2 min-w-[250px]">
              <Label>Selecionar Aluno</Label>
              <select
                value={selectedAluno}
                onChange={(e) => setSelectedAluno(e.target.value)}
                className="w-full border border-input rounded-md px-3 py-2 bg-white"
              >
                <option value="all" disabled>
                  Selecione um aluno...
                </option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome} - {aluno.turma?.nome_turma || ''}
                  </option>
                ))}
              </select>
            </div>
            {selectedAluno && selectedAluno !== 'all' && (
              <FiltroPeriodo value={periodo} onChange={setPeriodo} />
            )}
          </div>
        </CardContent>
      </Card>

      {selectedAluno && selectedAluno !== 'all' && loadingDados && (
        <Card>
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Carregando dados do aluno...</span>
          </CardContent>
        </Card>
      )}

      {selectedAluno && selectedAluno !== 'all' && !loadingDados && dados && dados.evolucao.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhuma avaliação concluída</p>
            <p className="text-muted-foreground mt-2">
              Este aluno ainda não possui avaliações finalizadas para exibir nos gráficos.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedAluno && selectedAluno !== 'all' && !loadingDados && dados && dados.evolucao.length > 0 && (
        <>
          <CardsResumo dados={dados.cardsResumo} />

          <ResumoAnalitico texto={dados.resumoTexto} />

          <Card>
            <CardHeader>
              <CardTitle>Evolução do Aluno</CardTitle>
              <CardDescription>
                Acompanhamento mensal dos scores por domínio cognitivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleMetricas metricas={metricas} onChange={setMetricas} />
              <GraficoEvolucaoAvancado dados={dados.evolucao} metricas={metricas} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perfil de Domínios Cognitivos</CardTitle>
              <CardDescription>
                Distribuição dos scores por domínio (última avaliação)
                {dados.temMediaTurma && ' - comparado com a média da turma'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoRadar dados={dados.radar} mostrarMedia={dados.temMediaTurma} />
              {!dados.temMediaTurma && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Ainda não há dados suficientes da turma para comparação
                </p>
              )}
            </CardContent>
          </Card>

          {dados.presenca.dados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Engajamento e Presença</CardTitle>
                <CardDescription>Frequência às sessões no período</CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoPresenca
                  dados={dados.presenca.dados}
                  presencaMesAtual={dados.presenca.mesAtual}
                  presencaMedia6Meses={dados.presenca.media6Meses}
                />
              </CardContent>
            </Card>
          )}

          <LinhaTempoEventos eventos={dados.eventos} />
        </>
      )}

      {(selectedAluno === 'all' || !selectedAluno) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Selecione um aluno para visualizar os relatórios
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-t-4 border-t-[#173b5a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Comparação de Turma
          </CardTitle>
          <CardDescription>
            Compare o desempenho dos alunos de uma turma no mês atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-[300px]">
            <Label>Selecionar Turma</Label>
            <select
              value={selectedTurma}
              onChange={(e) => setSelectedTurma(e.target.value)}
              className="w-full border border-input rounded-md px-3 py-2 bg-white"
            >
              <option value="all" disabled>
                Selecione uma turma...
              </option>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome_turma}
                </option>
              ))}
            </select>
          </div>

          {selectedTurma && selectedTurma !== 'all' && loadingTurma && (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Carregando dados da turma...</span>
            </div>
          )}

          {selectedTurma && selectedTurma !== 'all' && !loadingTurma && dadosComparacao.length === 0 && (
            <div className="py-8 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhuma avaliação na turma</p>
              <p className="text-muted-foreground mt-2">
                Não há avaliações concluídas para esta turma no mês atual.
              </p>
            </div>
          )}

          {selectedTurma && selectedTurma !== 'all' && !loadingTurma && dadosComparacao.length > 0 && (
            <div>
              <GraficoBarras dados={dadosComparacao} titulo="Score Total" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

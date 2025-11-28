'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  ClipboardCheck, 
  Users, 
  AlertTriangle,
  BarChart3,
  FileText,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface Aluno {
  id: string;
  nome: string;
  status: 'PENDENTE' | 'RASCUNHO' | 'CONCLUIDA';
}

interface TurmaEstatistica {
  id: string;
  nome_turma: string;
  moderador: {
    id: string;
    nome: string;
  };
  totalAlunos: number;
  concluidas: number;
  rascunhos: number;
  pendentes: number;
  percentualConcluido: number;
  alunos: Aluno[];
}

interface EstatisticasGerais {
  totalAvaliacoesMes: number;
  totalAlunosSistema: number;
  totalConcluidas: number;
  totalPendentes: number;
  totalRascunhos: number;
  percentualGeralConclusao: number;
}

interface DashboardData {
  mes: number;
  ano: number;
  estatisticasGerais: EstatisticasGerais;
  periodoResumo: {
    totalRealizadasPeriodo: number;
    mediaGeralPontuacao: number;
    pendentesMes: number;
  };
  evolucaoUltimosMeses: { mes: number; ano: number; label: string; total: number }[];
  turmas: TurmaEstatistica[];
}

const meses = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const periodoLabels: Record<'mes_atual' | 'ultimo_trimestre' | 'ultimo_semestre' | 'ano', string> = {
  mes_atual: 'Mês atual',
  ultimo_trimestre: 'Último trimestre',
  ultimo_semestre: 'Último semestre',
  ano: 'Ano',
};

function getStatusColor(status: string) {
  switch (status) {
    case 'CONCLUIDA':
      return 'bg-green-100 text-green-800';
    case 'RASCUNHO':
      return 'bg-yellow-100 text-yellow-800';
    case 'PENDENTE':
    default:
      return 'bg-red-100 text-red-800';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'CONCLUIDA':
      return 'Concluído';
    case 'RASCUNHO':
      return 'Rascunho';
    case 'PENDENTE':
    default:
      return 'Pendente';
  }
}

export default function DashboardAvaliacoes() {
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  const [mes, setMes] = useState(mesAtual);
  const [ano, setAno] = useState(anoAtual);
  const [periodo, setPeriodo] = useState<'mes_atual' | 'ultimo_trimestre' | 'ultimo_semestre' | 'ano'>('mes_atual');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTurmas, setExpandedTurmas] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [mes, ano, periodo]);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dashboard?mes=${mes}&ano=${ano}&periodo=${periodo}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleTurma(turmaId: string) {
    setExpandedTurmas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(turmaId)) {
        newSet.delete(turmaId);
      } else {
        newSet.add(turmaId);
      }
      return newSet;
    });
  }

  const anos = [];
  for (let i = anoAtual - 2; i <= anoAtual + 1; i++) {
    anos.push(i);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Erro ao carregar dados do dashboard
      </div>
    );
  }

  const { estatisticasGerais, turmas } = data;

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Avaliações</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o progresso das avaliações por turma
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Período:</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as typeof periodo)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.entries(periodoLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Mês:</label>
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {meses.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ano:</label>
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações no período</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.periodoResumo.totalRealizadasPeriodo}</div>
            <p className="text-xs text-muted-foreground">
              Período: {periodoLabels[periodo]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média geral de pontuação</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.periodoResumo.mediaGeralPontuacao}</div>
            <p className="text-xs text-muted-foreground">Apenas avaliações concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações pendentes</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${data.periodoResumo.pendentesMes > 0 ? 'text-red-600' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.periodoResumo.pendentesMes > 0 ? 'text-red-600' : ''}`}>
              {data.periodoResumo.pendentesMes}
            </div>
            <p className="text-xs text-muted-foreground">Alunos sem avaliação no mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conclusão geral</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticasGerais.percentualGeralConclusao}%</div>
            <p className="text-xs text-muted-foreground">
              {estatisticasGerais.totalConcluidas} de {estatisticasGerais.totalAlunosSistema} alunos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Evolução de avaliações (últimos 6 meses)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.evolucaoUltimosMeses} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground" />
                <XAxis dataKey="label" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip
                  formatter={(value: number) => [`${value} avaliação(ões)`, 'Total']}
                  labelFormatter={(label) => `Mês ${label}`}
                />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {estatisticasGerais.totalPendentes > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">
            <strong>Atenção:</strong> Existem {estatisticasGerais.totalPendentes} aluno(s) sem avaliação no mês de {meses.find(m => m.value === mes)?.label} de {ano}.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Visão Geral por Turma
          </CardTitle>
          <CardDescription>
            Clique em uma turma para ver os alunos e seus status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {turmas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma turma cadastrada
            </p>
          ) : (
            turmas.map((turma) => (
              <div key={turma.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTurma(turma.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {expandedTurmas.has(turma.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="text-left">
                      <h3 className="font-medium">{turma.nome_turma}</h3>
                      <p className="text-sm text-muted-foreground">
                        Moderador: {turma.moderador.nome}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600 font-medium">{turma.concluidas}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-yellow-600 font-medium">{turma.rascunhos}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-red-600 font-medium">{turma.pendentes}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Concluídas / Rascunho / Pendentes
                      </p>
                    </div>

                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{turma.percentualConcluido}%</span>
                        <span className="text-muted-foreground">{turma.totalAlunos} alunos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            turma.percentualConcluido === 100
                              ? 'bg-green-500'
                              : turma.percentualConcluido >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${turma.percentualConcluido}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {expandedTurmas.has(turma.id) && (
                  <div className="border-t bg-gray-50 p-4">
                    {turma.alunos.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhum aluno cadastrado nesta turma
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {turma.alunos.map((aluno) => (
                          <div
                            key={aluno.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{aluno.nome}</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  aluno.status
                                )}`}
                              >
                                {getStatusLabel(aluno.status)}
                              </span>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/avaliacoes/aluno/${aluno.id}?mes=${mes}&ano=${ano}`}>
                                {aluno.status === 'PENDENTE'
                                  ? 'Iniciar Avaliação'
                                  : aluno.status === 'RASCUNHO'
                                  ? 'Continuar'
                                  : 'Ver Avaliação'}
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

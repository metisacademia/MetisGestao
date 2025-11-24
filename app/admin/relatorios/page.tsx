'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraficoEvolucao } from '@/components/graficos/grafico-evolucao';
import { GraficoBarras } from '@/components/graficos/grafico-barras';
import { GraficoRadar } from '@/components/graficos/grafico-radar';
import { Loader2 } from 'lucide-react';

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('');

  const [dadosEvolucao, setDadosEvolucao] = useState<any[]>([]);
  const [dadosComparacao, setDadosComparacao] = useState<any[]>([]);
  const [dadosRadar, setDadosRadar] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [turmasRes, alunosRes] = await Promise.all([
          fetch('/api/admin/turmas'),
          fetch('/api/admin/alunos'),
        ]);

        const turmasData = await turmasRes.json();
        const alunosData = await alunosRes.json();

        setTurmas(turmasData);
        setAlunos(alunosData);

        if (alunosData.length > 0) {
          setSelectedAluno(alunosData[0].id);
          await carregarDadosAluno(alunosData[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  async function carregarDadosAluno(alunoId: string) {
    try {
      const res = await fetch(`/api/admin/relatorios/aluno/${alunoId}`);
      if (res.ok) {
        const data = await res.json();
        setDadosEvolucao(data.evolucao || []);
        setDadosRadar(data.radar || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do aluno:', error);
    }
  }

  async function carregarDadosTurma(turmaId: string) {
    try {
      const mesAtual = new Date().getMonth() + 1;
      const anoAtual = new Date().getFullYear();

      const res = await fetch(
        `/api/admin/relatorios/turma/${turmaId}?mes=${mesAtual}&ano=${anoAtual}`
      );
      if (res.ok) {
        const data = await res.json();
        setDadosComparacao(data.comparacao || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da turma:', error);
    }
  }

  useEffect(() => {
    if (selectedAluno) {
      carregarDadosAluno(selectedAluno);
    }
  }, [selectedAluno]);

  useEffect(() => {
    if (selectedTurma) {
      carregarDadosTurma(selectedTurma);
    }
  }, [selectedTurma]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground mt-2">
          Análise de desempenho e evolução dos alunos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Selecionar Aluno (Evolução)</Label>
          <select
            value={selectedAluno}
            onChange={(e) => setSelectedAluno(e.target.value)}
            className="w-full border border-input rounded-md px-3 py-2"
          >
            <option value="">Selecione um aluno...</option>
            {alunos.map((aluno: any) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} - {aluno.turma?.nome_turma || ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Selecionar Turma (Comparação)</Label>
          <select
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            className="w-full border border-input rounded-md px-3 py-2"
          >
            <option value="">Selecione uma turma...</option>
            {turmas.map((turma: any) => (
              <option key={turma.id} value={turma.id}>
                {turma.nome_turma}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedAluno && dadosEvolucao.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Aluno</CardTitle>
            <CardDescription>
              Acompanhamento mensal dos scores por domínio cognitivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoEvolucao dados={dadosEvolucao} />
          </CardContent>
        </Card>
      )}

      {selectedAluno && dadosRadar.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Domínios Cognitivos</CardTitle>
            <CardDescription>
              Distribuição dos scores por domínio (última avaliação)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoRadar dados={dadosRadar} />
          </CardContent>
        </Card>
      )}

      {selectedTurma && dadosComparacao.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Alunos da Turma</CardTitle>
            <CardDescription>
              Score total dos alunos no mês atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoBarras dados={dadosComparacao} titulo="Score Total" />
          </CardContent>
        </Card>
      )}

      {!selectedAluno && !selectedTurma && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Selecione um aluno ou turma para visualizar os relatórios
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

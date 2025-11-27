'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraficoEvolucao } from '@/components/graficos/grafico-evolucao';
import { GraficoRadar } from '@/components/graficos/grafico-radar';
import { Loader2, AlertCircle } from 'lucide-react';

interface Aluno {
  id: string;
  nome: string;
  turma: {
    id: string;
    nome_turma: string;
  };
}

export default function ModeradorRelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [loadingAluno, setLoadingAluno] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState('');
  const [dadosEvolucao, setDadosEvolucao] = useState<any[]>([]);
  const [dadosRadar, setDadosRadar] = useState<any[]>([]);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const res = await fetch('/api/moderador/relatorios/alunos');
        if (res.ok) {
          const data = await res.json();
          setAlunos(data);
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarAlunos();
  }, []);

  async function carregarDadosAluno(alunoId: string) {
    if (!alunoId) {
      setDadosEvolucao([]);
      setDadosRadar([]);
      return;
    }
    
    setLoadingAluno(true);
    setDadosEvolucao([]);
    setDadosRadar([]);
    
    try {
      const res = await fetch(`/api/moderador/relatorios/aluno/${alunoId}`);
      if (res.ok) {
        const data = await res.json();
        setDadosEvolucao(data.evolucao || []);
        setDadosRadar(data.radar || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do aluno:', error);
    } finally {
      setLoadingAluno(false);
    }
  }

  useEffect(() => {
    carregarDadosAluno(selectedAluno);
  }, [selectedAluno]);

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
          Acompanhamento do desempenho dos alunos das suas turmas
        </p>
      </div>

      <div className="space-y-2">
        <Label>Selecionar Aluno</Label>
        <select
          value={selectedAluno}
          onChange={(e) => setSelectedAluno(e.target.value)}
          className="w-full max-w-md border border-input rounded-md px-3 py-2"
        >
          <option value="">Selecione um aluno...</option>
          {alunos.map((aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome} - {aluno.turma.nome_turma}
            </option>
          ))}
        </select>
      </div>

      {selectedAluno && loadingAluno && (
        <Card>
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Carregando dados do aluno...</span>
          </CardContent>
        </Card>
      )}

      {selectedAluno && !loadingAluno && dadosEvolucao.length === 0 && (
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

      {selectedAluno && !loadingAluno && dadosEvolucao.length > 0 && (
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

      {selectedAluno && !loadingAluno && dadosRadar.length > 0 && (
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

      {!selectedAluno && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Selecione um aluno para visualizar os relatórios
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

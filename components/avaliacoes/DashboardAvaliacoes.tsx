'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface TurmaProgresso {
  id: string;
  nome: string;
  totalAlunos: number;
  avaliados: number;
  pendentes: number;
  percentual: number;
  status: 'VERDE' | 'AMARELO' | 'VERMELHO';
  moderador: string;
  info: string;
}

interface DashboardAvaliacoesProps {
  baseRoute: string; // '/admin', '/coordenador', '/moderador'
}

export default function DashboardAvaliacoes({ baseRoute }: DashboardAvaliacoesProps) {
  const [mes, setMes] = useState<string>(String(new Date().getMonth() + 1));
  const [ano, setAno] = useState<string>(String(new Date().getFullYear()));
  const [turmas, setTurmas] = useState<TurmaProgresso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const meses = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  useEffect(() => {
    async function carregarProgresso() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/avaliacoes/progresso?mes=${mes}&ano=${ano}`);
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const data = await response.json();
        setTurmas(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar o progresso das turmas.');
      } finally {
        setLoading(false);
      }
    }

    carregarProgresso();
  }, [mes, ano]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERDE': return 'bg-green-500';
      case 'AMARELO': return 'bg-yellow-500';
      case 'VERMELHO': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERDE': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Completo</Badge>;
      case 'AMARELO': 
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Parcial</Badge>;
      case 'VERMELHO': 
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Crítico</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Avaliações</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o progresso das avaliações por turma
          </p>
        </div>

        <div className="flex gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="space-y-1">
            <Label htmlFor="mes-filter">Mês</Label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger id="mes-filter" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meses.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="ano-filter">Ano</Label>
            <Select value={ano} onValueChange={setAno}>
              <SelectTrigger id="ano-filter" className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map((turma) => (
            <Link 
              key={turma.id} 
              href={`${baseRoute}/avaliacoes/turma/${turma.id}?mes=${mes}&ano=${ano}`}
              className="block group"
            >
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {turma.nome}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {turma.info}
                      </CardDescription>
                    </div>
                    {getStatusBadge(turma.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{turma.avaliados}/{turma.totalAlunos} ({turma.percentual}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(turma.status)} transition-all duration-500`} 
                        style={{ width: `${turma.percentual}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                    <div className="bg-muted/50 p-2 rounded text-center">
                      <div className="font-semibold text-lg">{turma.avaliados}</div>
                      <div className="text-muted-foreground text-xs">Avaliados</div>
                    </div>
                    <div className="bg-muted/50 p-2 rounded text-center">
                      <div className="font-semibold text-lg">{turma.pendentes}</div>
                      <div className="text-muted-foreground text-xs">Pendentes</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Users className="w-3 h-3" />
                    <span>Moderador: {turma.moderador}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {turmas.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhuma turma encontrada.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

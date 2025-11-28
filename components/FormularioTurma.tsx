'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Usuario {
  id: string;
  nome: string;
}

interface FormularioTurmaProps {
  moderadores: Usuario[];
  onSubmit?: () => void;
  turmaParaEditar?: {
    id: string;
    nome_turma: string;
    dia_semana: string;
    horario: string;
    turno: string;
    moderadorId: string;
    capacidade_maxima?: number | null;
    data_inicio?: string;
    data_fim?: string | null;
    status?: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
    local?: string | null;
  };
  apiBasePath?: string;
}

export default function FormularioTurma({
  moderadores,
  onSubmit,
  turmaParaEditar,
  apiBasePath = '/api/admin',
}: FormularioTurmaProps) {
  const [nome_turma, setNomeTurma] = useState(turmaParaEditar?.nome_turma || '');
  const [dia_semana, setDiaSemana] = useState(turmaParaEditar?.dia_semana || '');
  const [horario, setHorario] = useState(turmaParaEditar?.horario || '');
  const [turno, setTurno] = useState(turmaParaEditar?.turno || 'MANHA');
  const [moderadorId, setModeradorId] = useState(turmaParaEditar?.moderadorId ?? 'all');
  const [capacidade_maxima, setCapacidadeMaxima] = useState<string>(
    turmaParaEditar?.capacidade_maxima?.toString() || ''
  );
  const [data_inicio, setDataInicio] = useState(
    turmaParaEditar?.data_inicio ? new Date(turmaParaEditar.data_inicio).toISOString().split('T')[0] : ''
  );
  const [data_fim, setDataFim] = useState(
    turmaParaEditar?.data_fim ? new Date(turmaParaEditar.data_fim).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState<'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA'>(
    turmaParaEditar?.status || 'ABERTA'
  );
  const [local, setLocal] = useState(turmaParaEditar?.local || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (moderadorId === 'all') {
      setError('Selecione um moderador para a turma.');
      setLoading(false);
      return;
    }

    try {
      const url = turmaParaEditar
        ? `${apiBasePath}/turmas/${turmaParaEditar.id}`
        : `${apiBasePath}/turmas`;
      const method = turmaParaEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome_turma, 
          dia_semana, 
          horario, 
          turno, 
          moderadorId,
          capacidade_maxima: capacidade_maxima ? parseInt(capacidade_maxima) : null,
          data_inicio: data_inicio || undefined,
          data_fim: data_fim || null,
          status,
          local: local || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao salvar turma');
        setLoading(false);
        return;
      }

      // Reset form
      setNomeTurma('');
      setDiaSemana('');
      setHorario('');
      setTurno('MANHA');
      setModeradorId('all');
      setCapacidadeMaxima('');
      setDataInicio('');
      setDataFim('');
      setStatus('ABERTA');
      setLocal('');

      toast({
        variant: 'success',
        title: 'Sucesso!',
        description: turmaParaEditar 
          ? 'Turma atualizada com sucesso!'
          : 'Turma cadastrada com sucesso!',
      });

      onSubmit?.();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao tentar salvar a turma. Tente novamente.',
      });
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{turmaParaEditar ? 'Editar Turma' : 'Nova Turma'}</CardTitle>
        <CardDescription>
          {turmaParaEditar ? 'Atualize os dados da turma' : 'Adicione uma nova turma'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome_turma">Nome da Turma</Label>
              <Input
                id="nome_turma"
                placeholder="Ex: Aurora – Segunda 18h"
                value={nome_turma}
                onChange={(e) => setNomeTurma(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dia_semana">Dia da Semana</Label>
              <Input
                id="dia_semana"
                placeholder="Ex: Segunda-feira"
                value={dia_semana}
                onChange={(e) => setDiaSemana(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno</Label>
              <select
                id="turno"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                disabled={loading}
              >
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="NOITE">Noite</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="moderadorId">Moderador</Label>
              <select
                id="moderadorId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={moderadorId}
                onChange={(e) => setModeradorId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="all" disabled>
                  Selecione um moderador
                </option>
                {moderadores.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade_maxima">Capacidade Máxima</Label>
              <Input
                id="capacidade_maxima"
                type="number"
                min="0"
                placeholder="Ex: 15"
                value={capacidade_maxima}
                onChange={(e) => setCapacidadeMaxima(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA')}
                disabled={loading}
              >
                <option value="ABERTA">Aberta</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDA">Concluída</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={data_inicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Término</Label>
              <Input
                id="data_fim"
                type="date"
                value={data_fim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                placeholder="Ex: Sala 201 ou https://meet.google.com/abc-defg-hij"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Turma'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

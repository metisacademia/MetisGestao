'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Turma {
  id: string;
  nome_turma: string;
}

interface FormularioAlunoProps {
  turmas: Turma[];
  onSubmit?: () => void;
  alunoParaEditar?: {
    id: string;
    nome: string;
    turmaId: string;
    data_nascimento?: string;
    observacoes?: string;
  };
}

export default function FormularioAluno({
  turmas,
  onSubmit,
  alunoParaEditar,
}: FormularioAlunoProps) {
  const [nome, setNome] = useState(alunoParaEditar?.nome || '');
  const [turmaId, setTurmaId] = useState(alunoParaEditar?.turmaId || '');
  const [data_nascimento, setDataNascimento] = useState(
    alunoParaEditar?.data_nascimento
      ? alunoParaEditar.data_nascimento.split('T')[0]
      : ''
  );
  const [observacoes, setObservacoes] = useState(alunoParaEditar?.observacoes || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = alunoParaEditar
        ? `/api/admin/alunos/${alunoParaEditar.id}`
        : '/api/admin/alunos';
      const method = alunoParaEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          turmaId,
          data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
          observacoes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao salvar aluno');
        setLoading(false);
        return;
      }

      // Reset form
      setNome('');
      setTurmaId('');
      setDataNascimento('');
      setObservacoes('');

      onSubmit?.();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{alunoParaEditar ? 'Editar Aluno' : 'Novo Aluno'}</CardTitle>
        <CardDescription>
          {alunoParaEditar ? 'Atualize os dados do aluno' : 'Adicione um novo aluno'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="nome">Nome do Aluno</Label>
              <Input
                id="nome"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turmaId">Turma</Label>
              <select
                id="turmaId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome_turma}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={data_nascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Adicione observações sobre o aluno..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
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
            {loading ? 'Salvando...' : 'Salvar Aluno'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

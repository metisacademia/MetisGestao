'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { apiCall } from '@/lib/api-client';

interface ItemTemplate {
  id: string;
  codigo_item: string;
  titulo: string;
  descricao: string | null;
  tipo_resposta: string;
  config_opcoes: string | null;
  ordem: number;
  regra_pontuacao: string;
  dominio: {
    id: string;
    nome: string;
  };
}

interface TemplateAvaliacao {
  id: string;
  nome: string;
  itens: ItemTemplate[];
}

interface Aluno {
  id: string;
  nome: string;
  turma: {
    nome_turma: string;
  };
}

export default function AdminAvaliarAlunoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const alunoId = params.alunoId as string;
  const mes = Number(searchParams.get('mes')) || new Date().getMonth() + 1;
  const ano = Number(searchParams.get('ano')) || new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [template, setTemplate] = useState<TemplateAvaliacao | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [dataRealizacao, setDataRealizacao] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarDados() {
      try {
        const [alunoRes, templateRes] = await Promise.all([
          fetch(`/api/admin/alunos/${alunoId}`),
          fetch(`/api/admin/template-ativo?mes=${mes}&ano=${ano}`),
        ]);

        if (!alunoRes.ok || !templateRes.ok) {
          throw new Error('Erro ao carregar dados');
        }

        const alunoData = await alunoRes.json();
        const templateData = await templateRes.json();

        setAluno(alunoData);
        setTemplate(templateData);

        const avaliacaoRes = await fetch(
          `/api/admin/avaliacao/${alunoId}?mes=${mes}&ano=${ano}`
        );

        if (avaliacaoRes.ok) {
          const avaliacaoData = await avaliacaoRes.json();
          if (avaliacaoData.data_aplicacao) {
            setDataRealizacao(
              new Date(avaliacaoData.data_aplicacao).toISOString().split('T')[0]
            );
          }
          if (avaliacaoData.respostas) {
            const respostasMap: Record<string, string> = {};
            avaliacaoData.respostas.forEach((r: any) => {
              respostasMap[r.itemId] = r.valor_bruto;
            });
            setRespostas(respostasMap);
          }
        }
      } catch (err) {
        setError('Erro ao carregar dados da avaliação');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [alunoId, mes, ano]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await apiCall(`/api/admin/avaliacao/${alunoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alunoId,
          templateId: template!.id,
          mes_referencia: mes,
          ano_referencia: ano,
          data_aplicacao: dataRealizacao,
          respostas,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar avaliação');
      }

      alert('Avaliação salva com sucesso!');
      router.back();
    } catch (err) {
      setError('Erro ao salvar avaliação. Tente novamente.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderCampo = (item: ItemTemplate) => {
    const valor = respostas[item.id] || '';

    switch (item.tipo_resposta) {
      case 'NUMERO':
        return (
          <Input
            type="number"
            value={valor}
            onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
            required
          />
        );

      case 'SIM_NAO':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={item.id}
                value="Sim"
                checked={valor === 'Sim'}
                onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
                className="w-4 h-4"
                required
              />
              <span>Sim</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={item.id}
                value="Não"
                checked={valor === 'Não'}
                onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
                className="w-4 h-4"
                required
              />
              <span>Não</span>
            </label>
          </div>
        );

      case 'OPCAO_UNICA':
      case 'ESCALA':
        const opcoes = item.config_opcoes ? JSON.parse(item.config_opcoes) : [];
        return (
          <select
            value={valor}
            onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2"
            required
          >
            <option value="">Selecione...</option>
            {opcoes.map((opcao: string) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        );

      case 'TEXTO':
        return (
          <textarea
            value={valor}
            onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2 min-h-[100px]"
            required
          />
        );

      default:
        return <Input type="text" value={valor} disabled />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!aluno || !template) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">{error || 'Dados não encontrados'}</p>
        </CardContent>
      </Card>
    );
  }

  const itensOrdenados = [...template.itens].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Avaliação Cognitiva</h1>
        <p className="text-muted-foreground mt-2">
          Aluno: {aluno.nome} • Turma: {aluno.turma.nome_turma} • Mês/Ano: {mes}/{ano}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{template.nome}</CardTitle>
          <CardDescription>
            Preencha todos os campos da avaliação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-muted rounded-lg border">
              <Label htmlFor="data_realizacao" className="text-base font-medium">
                Data de Realização do Exame
              </Label>
              <Input
                id="data_realizacao"
                type="date"
                value={dataRealizacao}
                onChange={(e) => setDataRealizacao(e.target.value)}
                required
                className="mt-2 max-w-xs"
              />
            </div>

            {itensOrdenados.map((item) => (
              <div key={item.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label className="text-base font-medium">
                      {item.titulo}
                    </Label>
                    {item.descricao && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.descricao}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Domínio: {item.dominio.nome}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{renderCampo(item)}</div>
              </div>
            ))}

            {error && (
              <div className="text-sm text-destructive bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Avaliação
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

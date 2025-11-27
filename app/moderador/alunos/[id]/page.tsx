'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Plus, Check, X, Heart, Home, Users, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Aluno {
  id: string;
  nome: string;
  data_nascimento?: string;
  turma: { nome_turma: string };
}

interface Evento {
  id: string;
  data: string;
  titulo: string;
  descricao?: string;
  tipo: 'SAUDE' | 'ROTINA' | 'TURMA' | 'OUTROS';
}

interface Presenca {
  id: string;
  data: string;
  presente: boolean;
  observacao?: string;
}

const TIPOS_EVENTO = [
  { value: 'SAUDE', label: 'Saúde', icon: Heart },
  { value: 'ROTINA', label: 'Rotina', icon: Home },
  { value: 'TURMA', label: 'Turma', icon: Users },
  { value: 'OUTROS', label: 'Outros', icon: MoreHorizontal },
];

export default function DetalhesAlunoPage() {
  const params = useParams();
  const router = useRouter();
  const alunoId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  
  const [novoEvento, setNovoEvento] = useState({ data: '', titulo: '', descricao: '', tipo: 'OUTROS' });
  const [novaPresenca, setNovaPresenca] = useState({ data: '', presente: true });
  const [salvandoEvento, setSalvandoEvento] = useState(false);
  const [salvandoPresenca, setSalvandoPresenca] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      if (!alunoId) return;
      try {
        const [resAluno, resEventos, resPresencas] = await Promise.all([
          fetch(`/api/moderador/alunos/${alunoId}`),
          fetch(`/api/moderador/alunos/${alunoId}/eventos`),
          fetch(`/api/moderador/alunos/${alunoId}/presencas`),
        ]);

        if (resAluno.ok) {
          setAluno(await resAluno.json());
        } else {
          router.push('/moderador');
          return;
        }

        if (resEventos.ok) setEventos(await resEventos.json());
        if (resPresencas.ok) setPresencas(await resPresencas.json());
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [alunoId, router]);

  async function salvarEvento() {
    if (!novoEvento.data || !novoEvento.titulo) return;
    setSalvandoEvento(true);
    try {
      const res = await fetch(`/api/moderador/alunos/${alunoId}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEvento),
      });
      if (res.ok) {
        const evento = await res.json();
        setEventos((prev) => [evento, ...prev]);
        setNovoEvento({ data: '', titulo: '', descricao: '', tipo: 'OUTROS' });
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setSalvandoEvento(false);
    }
  }

  async function salvarPresenca() {
    if (!novaPresenca.data) return;
    setSalvandoPresenca(true);
    try {
      const res = await fetch(`/api/moderador/alunos/${alunoId}/presencas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaPresenca),
      });
      if (res.ok) {
        const presenca = await res.json();
        setPresencas((prev) => {
          const idx = prev.findIndex((p) => p.data.split('T')[0] === presenca.data.split('T')[0]);
          if (idx >= 0) {
            const novo = [...prev];
            novo[idx] = presenca;
            return novo;
          }
          return [presenca, ...prev];
        });
        setNovaPresenca({ data: '', presente: true });
      }
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
    } finally {
      setSalvandoPresenca(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!aluno) {
    return <div className="text-center py-12">Aluno não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/moderador">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{aluno.nome}</h1>
          <p className="text-muted-foreground">{aluno.turma.nome_turma}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Evento Relevante</CardTitle>
            <CardDescription>
              Registre eventos que podem afetar o desempenho do aluno
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="evento-data">Data</Label>
                <Input
                  id="evento-data"
                  type="date"
                  value={novoEvento.data}
                  onChange={(e) => setNovoEvento({ ...novoEvento, data: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evento-tipo">Tipo</Label>
                <select
                  id="evento-tipo"
                  value={novoEvento.tipo}
                  onChange={(e) => setNovoEvento({ ...novoEvento, tipo: e.target.value })}
                  className="w-full border border-input rounded-md px-3 py-2 bg-white h-10"
                >
                  {TIPOS_EVENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="evento-titulo">Título</Label>
              <Input
                id="evento-titulo"
                placeholder="Ex: Mudança de escola"
                value={novoEvento.titulo}
                onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evento-descricao">Descrição (opcional)</Label>
              <Input
                id="evento-descricao"
                placeholder="Detalhes adicionais..."
                value={novoEvento.descricao}
                onChange={(e) => setNovoEvento({ ...novoEvento, descricao: e.target.value })}
              />
            </div>
            <Button onClick={salvarEvento} disabled={salvandoEvento || !novoEvento.data || !novoEvento.titulo}>
              {salvandoEvento ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Adicionar Evento
            </Button>

            {eventos.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-3">Eventos Recentes</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {eventos.slice(0, 5).map((evento) => {
                    const TipoIcon = TIPOS_EVENTO.find((t) => t.value === evento.tipo)?.icon || MoreHorizontal;
                    return (
                      <div key={evento.id} className="flex items-start gap-3 bg-gray-50 p-2 rounded">
                        <TipoIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{evento.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(evento.data), "dd 'de' MMM, yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrar Presença</CardTitle>
            <CardDescription>
              Registre a presença ou falta do aluno nas sessões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="presenca-data">Data da Sessão</Label>
                <Input
                  id="presenca-data"
                  type="date"
                  value={novaPresenca.data}
                  onChange={(e) => setNovaPresenca({ ...novaPresenca, data: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={novaPresenca.presente ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNovaPresenca({ ...novaPresenca, presente: true })}
                    className={novaPresenca.presente ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Presente
                  </Button>
                  <Button
                    type="button"
                    variant={!novaPresenca.presente ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNovaPresenca({ ...novaPresenca, presente: false })}
                    className={!novaPresenca.presente ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Falta
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={salvarPresenca} disabled={salvandoPresenca || !novaPresenca.data}>
              {salvandoPresenca ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Registrar Presença
            </Button>

            {presencas.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-3">Presenças Recentes</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {presencas.slice(0, 10).map((presenca) => (
                    <div key={presenca.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                      {presenca.presente ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">
                          {format(new Date(presenca.data), "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${presenca.presente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {presenca.presente ? 'Presente' : 'Falta'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Link href={`/moderador/relatorios?aluno=${alunoId}`}>
          <Button variant="outline">Ver Relatórios</Button>
        </Link>
      </div>
    </div>
  );
}

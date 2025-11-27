'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Check, ChevronDown, ChevronRight, ChevronUp, Target, CheckCircle2, Circle, ArrowUp, ArrowDown, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import { apiCall } from '@/lib/api-client';
import { calcularPontuacaoItem } from '@/lib/pontuacao';
import * as Collapsible from '@radix-ui/react-collapsible';

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
    pontuacao_maxima?: number;
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
  turmaId: string;
  turma: {
    id: string;
    nome_turma: string;
  };
}

interface ProximoAluno {
  id: string;
  nome: string;
}

interface DomainGroup {
  dominioId: string;
  dominioNome: string;
  itens: ItemTemplate[];
}

function parseRegraPontuacao(regraJson: string): any {
  try {
    return JSON.parse(regraJson);
  } catch {
    return null;
  }
}

function renderGabarito(item: ItemTemplate) {
  const regra = parseRegraPontuacao(item.regra_pontuacao);
  if (!regra) return null;

  switch (regra.tipo) {
    case 'alternativa_correta':
      return (
        <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1">
          <Check className="w-3 h-3" />
          Correta: <strong>{regra.correta}</strong> ({regra.pontos_correta} pts)
        </div>
      );

    case 'sim_nao':
      return (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">
          <Target className="w-3 h-3" />
          Sim: {regra.sim} pt(s) • Não: {regra.nao} pt(s)
        </div>
      );

    case 'faixas':
      const faixasTexto = regra.faixas.map((f: any) => {
        if (f.ate !== undefined && f.acima === undefined) {
          return `${f.pontos} pt(s) (≤${f.ate})`;
        }
        if (f.acima !== undefined && f.ate === undefined) {
          return `${f.pontos} pt(s) (>${f.acima})`;
        }
        if (f.min !== undefined && f.max !== undefined) {
          return `${f.pontos} pt(s) (${f.min}-${f.max})`;
        }
        return `${f.pontos} pt(s)`;
      }).join(' • ');
      return (
        <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
          <Target className="w-3 h-3 inline mr-1" />
          Faixas: {faixasTexto}
        </div>
      );

    case 'mapa':
      const entries = Object.entries(regra.mapa);
      const maxEntry = entries.reduce((a: any, b: any) => (b[1] > a[1] ? b : a), entries[0]);
      const mapaTexto = entries.map(([k, v]) => `${k}: ${v} pt(s)`).join(' • ');
      return (
        <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
          <Target className="w-3 h-3 inline mr-1" />
          {mapaTexto}
          {maxEntry && (
            <span className="ml-2 text-emerald-600">
              <Check className="w-3 h-3 inline" /> Melhor: {maxEntry[0]}
            </span>
          )}
        </div>
      );

    default:
      return null;
  }
}

function getCorretaSimNao(regraJson: string): string | null {
  const regra = parseRegraPontuacao(regraJson);
  if (!regra || regra.tipo !== 'alternativa_correta') return null;
  return regra.correta;
}

function getMelhorOpcao(regraJson: string, opcoes: string[]): string | null {
  const regra = parseRegraPontuacao(regraJson);
  if (!regra) return null;

  if (regra.tipo === 'mapa') {
    let melhor = null;
    let maiorPontos = -Infinity;
    for (const opcao of opcoes) {
      const pontos = regra.mapa[opcao] || 0;
      if (pontos > maiorPontos) {
        maiorPontos = pontos;
        melhor = opcao;
      }
    }
    return melhor;
  }

  return null;
}

export default function CoordenadorAvaliarAlunoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const alunoId = params.alunoId as string;
  const mes = Number(searchParams.get('mes')) || new Date().getMonth() + 1;
  const ano = Number(searchParams.get('ano')) || new Date().getFullYear();
  const turmaIdParam = searchParams.get('turmaId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [template, setTemplate] = useState<TemplateAvaliacao | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [dataRealizacao, setDataRealizacao] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [avaliacaoId, setAvaliacaoId] = useState<string | null>(null);
  const [avaliacaoStatus, setAvaliacaoStatus] = useState<string | null>(null);
  const [reabrindo, setReabrindo] = useState(false);
  
  const [salvouComSucesso, setSalvouComSucesso] = useState(false);
  const [proximoAluno, setProximoAluno] = useState<ProximoAluno | null>(null);
  const [carregandoProximo, setCarregandoProximo] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [alunoRes, templateRes] = await Promise.all([
          fetch(`/api/coordenador/alunos/${alunoId}`),
          fetch(`/api/coordenador/template-ativo?mes=${mes}&ano=${ano}`),
        ]);

        if (!alunoRes.ok || !templateRes.ok) {
          throw new Error('Erro ao carregar dados');
        }

        const alunoData = await alunoRes.json();
        const templateData = await templateRes.json();

        setAluno(alunoData);
        setTemplate(templateData);

        const expandedInit: Record<string, boolean> = {};
        const dominiosUnicos = new Set<string>();
        templateData.itens?.forEach((item: ItemTemplate) => {
          dominiosUnicos.add(item.dominio.id);
        });
        dominiosUnicos.forEach((id) => {
          expandedInit[id] = true;
        });
        setExpandedSections(expandedInit);

        const avaliacaoRes = await apiCall(
          `/api/coordenador/salvar-avaliacao?alunoId=${alunoId}&mes=${mes}&ano=${ano}`
        );

        if (avaliacaoRes.ok) {
          const avaliacaoData = await avaliacaoRes.json();
          setAvaliacaoId(avaliacaoData.id);
          setAvaliacaoStatus(avaliacaoData.status);
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

  const domainGroups = useMemo<DomainGroup[]>(() => {
    if (!template) return [];

    const groups: Record<string, DomainGroup> = {};
    const itensOrdenados = [...template.itens].sort((a, b) => a.ordem - b.ordem);

    itensOrdenados.forEach((item) => {
      if (!groups[item.dominio.id]) {
        groups[item.dominio.id] = {
          dominioId: item.dominio.id,
          dominioNome: item.dominio.nome,
          itens: [],
        };
      }
      groups[item.dominio.id].itens.push(item);
    });

    return Object.values(groups);
  }, [template]);

  const pontuacoesPorItem = useMemo<Record<string, number>>(() => {
    const pontuacoes: Record<string, number> = {};
    if (!template) return pontuacoes;

    template.itens.forEach((item) => {
      const valor = respostas[item.id];
      if (valor !== undefined && valor !== '') {
        pontuacoes[item.id] = calcularPontuacaoItem(valor, item.regra_pontuacao);
      }
    });

    return pontuacoes;
  }, [template, respostas]);

  const estatisticasPorDominio = useMemo(() => {
    const stats: Record<string, { respondidos: number; total: number; pontuacao: number }> = {};

    domainGroups.forEach((group) => {
      const respondidos = group.itens.filter((item) => respostas[item.id] !== undefined && respostas[item.id] !== '').length;
      const pontuacao = group.itens.reduce((acc, item) => acc + (pontuacoesPorItem[item.id] || 0), 0);
      stats[group.dominioId] = {
        respondidos,
        total: group.itens.length,
        pontuacao,
      };
    });

    return stats;
  }, [domainGroups, respostas, pontuacoesPorItem]);

  const pontuacaoTotal = useMemo(() => {
    return Object.values(pontuacoesPorItem).reduce((acc, p) => acc + p, 0);
  }, [pontuacoesPorItem]);

  const totalRespondidos = useMemo(() => {
    if (!template) return 0;
    return template.itens.filter((item) => respostas[item.id] !== undefined && respostas[item.id] !== '').length;
  }, [template, respostas]);

  const totalItens = template?.itens.length || 0;

  const buscarProximoAluno = async () => {
    if (!aluno) return;
    
    setCarregandoProximo(true);
    try {
      const turmaId = turmaIdParam || aluno.turmaId || aluno.turma?.id;
      if (!turmaId) return;
      
      const response = await fetch(`/api/coordenador/turmas/${turmaId}`);
      if (!response.ok) return;
      
      const turmaData = await response.json();
      const alunos = turmaData.alunos || [];
      
      const avaliacoesPromises = alunos.map((a: any) => 
        fetch(`/api/coordenador/salvar-avaliacao?alunoId=${a.id}&mes=${mes}&ano=${ano}`)
          .then(r => r.ok ? r.json().catch(() => null) : null)
          .catch(() => null)
      );
      
      const avaliacoes = await Promise.all(avaliacoesPromises);
      
      const alunoAtualIdx = alunos.findIndex((a: any) => a.id === alunoId);
      
      for (let i = alunoAtualIdx + 1; i < alunos.length; i++) {
        const avaliacao = avaliacoes[i];
        if (!avaliacao || avaliacao.status !== 'CONCLUIDA') {
          setProximoAluno({ id: alunos[i].id, nome: alunos[i].nome });
          return;
        }
      }
      
      for (let i = 0; i < alunoAtualIdx; i++) {
        const avaliacao = avaliacoes[i];
        if (!avaliacao || avaliacao.status !== 'CONCLUIDA') {
          setProximoAluno({ id: alunos[i].id, nome: alunos[i].nome });
          return;
        }
      }
      
      setProximoAluno(null);
    } catch (err) {
      console.error('Erro ao buscar próximo aluno:', err);
    } finally {
      setCarregandoProximo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await apiCall(`/api/coordenador/salvar-avaliacao`, {
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

      setSalvouComSucesso(true);
      setAvaliacaoStatus('CONCLUIDA');
      await buscarProximoAluno();
    } catch (err) {
      setError('Erro ao salvar avaliação. Tente novamente.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReabrirAvaliacao = async () => {
    if (!avaliacaoId) return;
    
    setReabrindo(true);
    setError('');

    try {
      const response = await apiCall(`/api/coordenador/reabrir-avaliacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avaliacaoId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao reabrir avaliação');
      }

      setAvaliacaoStatus('RASCUNHO');
      setSalvouComSucesso(false);
    } catch (err) {
      setError('Erro ao reabrir avaliação. Tente novamente.');
      console.error(err);
    } finally {
      setReabrindo(false);
    }
  };

  const irParaProximoAluno = () => {
    if (!proximoAluno || !aluno) return;
    const turmaId = turmaIdParam || aluno.turmaId || aluno.turma?.id;
    router.push(`/coordenador/avaliacoes/aluno/${proximoAluno.id}?mes=${mes}&ano=${ano}&turmaId=${turmaId}`);
  };

  const toggleSection = (dominioId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [dominioId]: !prev[dominioId],
    }));
  };

  const scrollToSection = (dominioId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [dominioId]: true,
    }));
    setTimeout(() => {
      sectionRefs.current[dominioId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const expandAll = () => {
    const newExpanded: Record<string, boolean> = {};
    domainGroups.forEach((g) => {
      newExpanded[g.dominioId] = true;
    });
    setExpandedSections(newExpanded);
  };

  const collapseAll = () => {
    const newExpanded: Record<string, boolean> = {};
    domainGroups.forEach((g) => {
      newExpanded[g.dominioId] = false;
    });
    setExpandedSections(newExpanded);
  };

  const renderCampo = (item: ItemTemplate) => {
    const valor = respostas[item.id] || '';
    const pontos = pontuacoesPorItem[item.id];
    const isDisabled = avaliacaoStatus === 'CONCLUIDA';

    switch (item.tipo_resposta) {
      case 'NUMERO':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={valor}
              onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
              required
              disabled={isDisabled}
            />
            {valor && pontos !== undefined && (
              <div className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                Pontuação: {pontos} pt(s)
              </div>
            )}
          </div>
        );

      case 'SIM_NAO':
        const correta = getCorretaSimNao(item.regra_pontuacao);
        return (
          <div className="space-y-2">
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                valor === 'Sim' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
              } ${correta?.toLowerCase() === 'sim' ? 'ring-2 ring-emerald-500 ring-offset-1' : ''} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name={item.id}
                  value="Sim"
                  checked={valor === 'Sim'}
                  onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
                  className="w-4 h-4"
                  required
                  disabled={isDisabled}
                />
                <span>Sim</span>
                {correta?.toLowerCase() === 'sim' && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </label>
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                valor === 'Não' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
              } ${correta?.toLowerCase() === 'não' ? 'ring-2 ring-emerald-500 ring-offset-1' : ''} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name={item.id}
                  value="Não"
                  checked={valor === 'Não'}
                  onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
                  className="w-4 h-4"
                  required
                  disabled={isDisabled}
                />
                <span>Não</span>
                {correta?.toLowerCase() === 'não' && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </label>
            </div>
            {valor && pontos !== undefined && (
              <div className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                Pontuação: {pontos} pt(s)
              </div>
            )}
          </div>
        );

      case 'OPCAO_UNICA':
      case 'ESCALA':
        const opcoes = item.config_opcoes ? JSON.parse(item.config_opcoes) : [];
        const melhorOpcao = getMelhorOpcao(item.regra_pontuacao, opcoes);
        const regra = parseRegraPontuacao(item.regra_pontuacao);
        
        return (
          <div className="space-y-2">
            <select
              value={valor}
              onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
              className="w-full border border-input rounded-md px-3 py-2"
              required
              disabled={isDisabled}
            >
              <option value="">Selecione...</option>
              {opcoes.map((opcao: string) => {
                const pontosOpcao = regra?.tipo === 'mapa' ? regra.mapa[opcao] : null;
                return (
                  <option key={opcao} value={opcao}>
                    {opcao}
                    {pontosOpcao !== null && ` (${pontosOpcao} pts)`}
                    {melhorOpcao === opcao && ' ✓'}
                  </option>
                );
              })}
            </select>
            {regra?.tipo === 'mapa' && (
              <div className="flex flex-wrap gap-2 mt-2">
                {opcoes.map((opcao: string) => {
                  const pontosOpcao = regra.mapa[opcao] || 0;
                  const isMelhor = melhorOpcao === opcao;
                  return (
                    <span
                      key={opcao}
                      className={`text-xs px-2 py-1 rounded ${
                        isMelhor
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {opcao}: {pontosOpcao} pt(s)
                      {isMelhor && <Check className="w-3 h-3 inline ml-1" />}
                    </span>
                  );
                })}
              </div>
            )}
            {valor && pontos !== undefined && (
              <div className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                Pontuação: {pontos} pt(s)
              </div>
            )}
          </div>
        );

      case 'TEXTO':
        return (
          <textarea
            value={valor}
            onChange={(e) => setRespostas({ ...respostas, [item.id]: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2 min-h-[100px]"
            required
            disabled={isDisabled}
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Avaliação Cognitiva</h1>
        <p className="text-muted-foreground mt-2">
          Aluno: {aluno.nome} • Turma: {aluno.turma.nome_turma} • Mês/Ano: {mes}/{ano}
        </p>
      </div>

      {avaliacaoStatus === 'CONCLUIDA' && !salvouComSucesso && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Avaliação já concluída</p>
                  <p className="text-sm text-amber-700">
                    Esta avaliação foi salva anteriormente. Para editar, reabra-a primeiro.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleReabrirAvaliacao}
                disabled={reabrindo}
                className="border-amber-400 text-amber-700 hover:bg-amber-100"
              >
                {reabrindo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reabrindo...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reabrir para Edição
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {salvouComSucesso && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Avaliação salva com sucesso!</p>
                  <p className="text-sm text-green-700">
                    {proximoAluno 
                      ? `Próximo aluno não avaliado: ${proximoAluno.nome}`
                      : 'Todos os alunos da turma já foram avaliados.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {proximoAluno && (
                  <Button
                    onClick={irParaProximoAluno}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={carregandoProximo}
                  >
                    {carregandoProximo ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    Próximo Aluno
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-green-400 text-green-700 hover:bg-green-100"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="sticky top-4 z-10 shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Pontuação em Tempo Real
              </CardTitle>
              <CardDescription>
                Progresso: {totalRespondidos}/{totalItens} itens respondidos
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{pontuacaoTotal.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">pontos totais</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="w-full bg-muted rounded-full h-3 mb-4">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${totalItens > 0 ? (totalRespondidos / totalItens) * 100 : 0}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {domainGroups.map((group) => {
              const stats = estatisticasPorDominio[group.dominioId];
              const isComplete = stats?.respondidos === stats?.total;
              return (
                <Button
                  key={group.dominioId}
                  variant={isComplete ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => scrollToSection(group.dominioId)}
                  className="flex items-center gap-1"
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  <span className="max-w-[100px] truncate">{group.dominioNome}</span>
                  <span className="text-xs opacity-75">
                    ({stats?.respondidos}/{stats?.total})
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={expandAll}>
              <ChevronDown className="w-4 h-4 mr-1" />
              Expandir Todos
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll}>
              <ChevronUp className="w-4 h-4 mr-1" />
              Recolher Todos
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{template.nome}</CardTitle>
          <CardDescription>
            {avaliacaoStatus === 'CONCLUIDA' 
              ? 'Visualização da avaliação concluída'
              : 'Preencha todos os campos da avaliação'}
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
                disabled={avaliacaoStatus === 'CONCLUIDA'}
              />
            </div>

            {domainGroups.map((group, groupIndex) => {
              const stats = estatisticasPorDominio[group.dominioId];
              const isComplete = stats?.respondidos === stats?.total;
              const isExpanded = expandedSections[group.dominioId];

              return (
                <div
                  key={group.dominioId}
                  ref={(el) => { sectionRefs.current[group.dominioId] = el; }}
                  className="border rounded-lg overflow-hidden"
                >
                  <Collapsible.Root open={isExpanded} onOpenChange={() => toggleSection(group.dominioId)}>
                    <Collapsible.Trigger asChild>
                      <button
                        type="button"
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                          isComplete ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {group.dominioNome}
                              {isComplete && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {stats?.respondidos}/{stats?.total} respondidos • {stats?.pontuacao.toFixed(1)} pts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isComplete ? 'bg-emerald-500' : 'bg-primary'
                              }`}
                              style={{ width: `${stats ? (stats.respondidos / stats.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    </Collapsible.Trigger>

                    <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                      <div className="p-4 space-y-4 border-t">
                        {group.itens.map((item) => (
                          <div key={item.id} className="space-y-2 p-4 bg-white border rounded-lg shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Label className="text-base font-medium">
                                    {item.titulo}
                                  </Label>
                                  {respostas[item.id] && (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                  )}
                                </div>
                                {item.descricao && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.descricao}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mb-2">
                              {renderGabarito(item)}
                            </div>
                            <div className="mt-3">{renderCampo(item)}</div>
                          </div>
                        ))}

                        <div className="flex justify-between pt-2">
                          {groupIndex > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => scrollToSection(domainGroups[groupIndex - 1].dominioId)}
                            >
                              <ArrowUp className="w-4 h-4 mr-1" />
                              {domainGroups[groupIndex - 1].dominioNome}
                            </Button>
                          )}
                          {groupIndex < domainGroups.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => scrollToSection(domainGroups[groupIndex + 1].dominioId)}
                              className="ml-auto"
                            >
                              {domainGroups[groupIndex + 1].dominioNome}
                              <ArrowDown className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
              );
            })}

            {error && (
              <div className="text-sm text-destructive bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {avaliacaoStatus !== 'CONCLUIDA' && !salvouComSucesso && (
              <div className="flex gap-3 sticky bottom-4 bg-background p-4 rounded-lg border shadow-lg">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Avaliação ({totalRespondidos}/{totalItens} respondidos)
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
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

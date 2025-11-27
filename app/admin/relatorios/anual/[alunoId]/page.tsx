'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GraficoEvolucao } from '@/components/graficos/grafico-evolucao';
import { GraficoRadar } from '@/components/graficos/grafico-radar';
import { ResumoAnalitico } from '@/components/relatorios/resumo-analitico';
import { Loader2, AlertCircle, ArrowLeft, Printer, Download } from 'lucide-react';
import Link from 'next/link';

interface DadosAnuais {
  aluno: { id: string; nome: string; turma: string };
  ano: number;
  anosDisponiveis: number[];
  evolucaoTrimestral: Array<{
    mes_ano: string;
    score_total: number;
    score_fluencia: number;
    score_cultura: number;
    score_interpretacao: number;
    score_atencao: number;
    score_auto_percepcao: number;
  }>;
  radarAnual: Array<{ dominio: string; aluno: number }>;
  presencaMediaAnual: number;
  resumoTexto: string;
}

export default function RelatorioAnualPage() {
  const params = useParams();
  const router = useRouter();
  const alunoId = params?.alunoId as string;
  const printRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<DadosAnuais | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    async function carregarDados() {
      if (!alunoId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/relatorios/aluno/${alunoId}/anual?ano=${anoSelecionado}`);
        if (res.ok) {
          const data = await res.json();
          setDados(data);
        } else {
          router.push('/admin/relatorios');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [alunoId, anoSelecionado, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportarCSV = () => {
    if (alunoId) {
      window.open(`/api/admin/relatorios/exportar/aluno/${alunoId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <p className="text-lg">Dados não encontrados</p>
        <Link href="/admin/relatorios">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Relatórios
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Link href="/admin/relatorios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Relatório Anual</h1>
            <p className="text-muted-foreground">{dados.aluno.nome} - {dados.aluno.turma}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportarCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="default" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="no-print">
        <div className="flex items-center gap-4">
          <Label>Ano:</Label>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
            className="border border-input rounded-md px-3 py-2 bg-white"
          >
            {dados.anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>
      </div>

      <div id="print-area" ref={printRef} className="space-y-6">
        <div className="text-center print:mb-8">
          <h2 className="text-2xl font-bold text-[#173b5a]">Métis - Academia da Mente</h2>
          <h3 className="text-xl mt-2">Relatório Anual {dados.ano}</h3>
          <p className="text-muted-foreground mt-1">{dados.aluno.nome} - {dados.aluno.turma}</p>
        </div>

        {dados.evolucaoTrimestral.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhuma avaliação neste ano</p>
              <p className="text-muted-foreground mt-2">
                Não há avaliações concluídas para o ano de {dados.ano}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <ResumoAnalitico texto={dados.resumoTexto} />

            <Card>
              <CardHeader>
                <CardTitle>Evolução Trimestral</CardTitle>
                <CardDescription>
                  Média dos scores por trimestre ao longo do ano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoEvolucao dados={dados.evolucaoTrimestral} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perfil Anual de Domínios Cognitivos</CardTitle>
                <CardDescription>
                  Média anual por domínio cognitivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoRadar dados={dados.radarAnual} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engajamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-[#f8f1e7] px-4 py-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Presença média no ano</p>
                    <p className="text-2xl font-bold text-[#173b5a]">
                      {dados.presencaMediaAnual.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="text-center text-xs text-muted-foreground print:mt-8">
          <p suppressHydrationWarning>Relatório gerado em {new Date().toLocaleDateString('pt-BR')}</p>
          <p>Métis - Academia da Mente</p>
        </div>
      </div>
    </div>
  );
}

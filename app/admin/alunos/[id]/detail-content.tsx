'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlunoDetalhes } from '@/lib/aluno-details';

function formatMesAno(mes: number, ano: number) {
  const data = new Date(ano, mes - 1);
  return data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'CONCLUIDA':
      return 'Concluída';
    case 'RASCUNHO':
      return 'Rascunho';
    default:
      return 'Pendente';
  }
}

export default function AlunoDetalheContent({ detalhes }: { detalhes: AlunoDetalhes }) {
  const { aluno, avaliacoes, mediasDominios } = detalhes;

  const linhaData = avaliacoes.map((avaliacao) => ({
    label: formatMesAno(avaliacao.mes_referencia, avaliacao.ano_referencia),
    score: avaliacao.score_total,
  }));

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div className="flex items-center gap-3">
        <Link href="/admin/alunos">
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para lista
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{aluno.nome}</h1>
          <p className="text-muted-foreground text-sm">Detalhes e histórico de avaliações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Aluno</CardTitle>
            <CardDescription>Dados cadastrais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Nome</span>
              <span className="font-medium text-right">{aluno.nome}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Turma</span>
              <span className="font-medium text-right">{aluno.turma.nome_turma}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Moderador</span>
              <span className="font-medium text-right">{aluno.turma.moderador.nome}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Turno</span>
              <span className="font-medium text-right">{aluno.turma.turno}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Data de nascimento</span>
              <span className="font-medium text-right">
                {aluno.data_nascimento
                  ? new Date(aluno.data_nascimento).toLocaleDateString('pt-BR')
                  : 'Não informado'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground">Observações</span>
              <span className="font-medium">
                {aluno.observacoes?.trim() || 'Nenhuma observação registrada'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Domínio</CardTitle>
            <CardDescription>Média das avaliações</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {mediasDominios.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={mediasDominios} outerRadius={100}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dominio" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Radar name="Pontuação" dataKey="media" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                  <Tooltip formatter={(value: number) => value.toFixed(1)} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">Sem dados de domínio ainda.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Histórico de Avaliações</CardTitle>
            <CardDescription>Resultados por período</CardDescription>
          </CardHeader>
          <CardContent>
            {avaliacoes.length === 0 ? (
              <div className="text-muted-foreground text-sm">Nenhuma avaliação encontrada</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Score Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoes.map((avaliacao) => (
                    <TableRow key={avaliacao.id}>
                      <TableCell>{formatMesAno(avaliacao.mes_referencia, avaliacao.ano_referencia)}</TableCell>
                      <TableCell className="font-medium">{avaliacao.score_total.toFixed(1)}</TableCell>
                      <TableCell>{getStatusLabel(avaliacao.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Evolução</CardTitle>
            <CardDescription>Score total nos meses avaliados</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {linhaData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={linhaData} margin={{ left: 6, right: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => value.toFixed(1)} />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">Sem avaliações para exibir o gráfico.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

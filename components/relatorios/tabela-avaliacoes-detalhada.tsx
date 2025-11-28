'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AvaliacaoDetalhada {
  mes_ano: string;
  data_aplicacao: string;
  score_total: number;
  score_fluencia_0a10: number;
  score_cultura_0a10: number;
  score_interpretacao_0a10: number;
  score_atencao_0a10: number;
  score_auto_percepcao_0a10: number;
}

interface TabelaAvaliacoesDetalhadaProps {
  dados: AvaliacaoDetalhada[];
}

export function TabelaAvaliacoesDetalhada({ dados }: TabelaAvaliacoesDetalhadaProps) {
  if (dados.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma avaliação encontrada no período selecionado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mês/Ano</TableHead>
            <TableHead>Data de Aplicação</TableHead>
            <TableHead className="text-center">Score Total</TableHead>
            <TableHead className="text-center">Fluência</TableHead>
            <TableHead className="text-center">Cultura</TableHead>
            <TableHead className="text-center">Interpretação</TableHead>
            <TableHead className="text-center">Atenção</TableHead>
            <TableHead className="text-center">Auto-percepção</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((avaliacao, index) => {
            const dataFormatada = format(new Date(avaliacao.data_aplicacao), 'dd/MM/yyyy', { locale: ptBR });

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{avaliacao.mes_ano}</TableCell>
                <TableCell>{dataFormatada}</TableCell>
                <TableCell className="text-center font-bold text-[#173b5a]">
                  {avaliacao.score_total.toFixed(1)}
                </TableCell>
                <TableCell className="text-center">{avaliacao.score_fluencia_0a10.toFixed(1)}</TableCell>
                <TableCell className="text-center">{avaliacao.score_cultura_0a10.toFixed(1)}</TableCell>
                <TableCell className="text-center">{avaliacao.score_interpretacao_0a10.toFixed(1)}</TableCell>
                <TableCell className="text-center">{avaliacao.score_atencao_0a10.toFixed(1)}</TableCell>
                <TableCell className="text-center">{avaliacao.score_auto_percepcao_0a10.toFixed(1)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

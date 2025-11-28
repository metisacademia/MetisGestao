'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DadosComparacao {
  alunoId: string;
  nome: string;
  score_total: number | null;
  temAvaliacao: boolean;
  posicao: number | null;
}

interface TabelaRankingProps {
  dados: DadosComparacao[];
}

function getMedalEmoji(posicao: number | null): string {
  if (!posicao) return '';
  if (posicao === 1) return '🥇';
  if (posicao === 2) return '🥈';
  if (posicao === 3) return '🥉';
  return '';
}

export function TabelaRanking({ dados }: TabelaRankingProps) {
  if (dados.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum aluno encontrado nesta turma.
      </div>
    );
  }

  // Separar alunos com e sem avaliação
  const alunosComAvaliacao = dados.filter((a) => a.temAvaliacao);
  const alunosSemAvaliacao = dados.filter((a) => !a.temAvaliacao);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Posição</TableHead>
            <TableHead>Nome do Aluno</TableHead>
            <TableHead className="text-center w-[120px]">Score Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Alunos com avaliação */}
          {alunosComAvaliacao.map((aluno) => {
            const medal = getMedalEmoji(aluno.posicao);

            return (
              <TableRow key={aluno.alunoId}>
                <TableCell className="font-medium">
                  {medal && <span className="mr-2">{medal}</span>}
                  {aluno.posicao}º
                </TableCell>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell className="text-center font-bold text-[#173b5a]">
                  {aluno.score_total?.toFixed(1)}
                </TableCell>
              </TableRow>
            );
          })}

          {/* Separador se houver alunos sem avaliação */}
          {alunosSemAvaliacao.length > 0 && (
            <TableRow>
              <TableCell colSpan={3} className="bg-muted text-center py-3">
                <span className="text-sm italic text-muted-foreground">
                  Alunos sem avaliação no período
                </span>
              </TableCell>
            </TableRow>
          )}

          {/* Alunos sem avaliação */}
          {alunosSemAvaliacao.map((aluno) => (
            <TableRow key={aluno.alunoId} className="opacity-60">
              <TableCell className="text-muted-foreground">-</TableCell>
              <TableCell className="text-muted-foreground">{aluno.nome}</TableCell>
              <TableCell className="text-center text-muted-foreground text-sm">
                Sem avaliação
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

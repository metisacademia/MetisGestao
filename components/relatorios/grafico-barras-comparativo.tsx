'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DadosComparacao {
  alunoId: string;
  nome: string;
  score_total: number | null;
  temAvaliacao: boolean;
  posicao: number | null;
}

interface GraficoBarrasComparativoProps {
  dados: DadosComparacao[];
}

interface PayloadItem {
  name: string;
  value: number;
  payload: DadosComparacao;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: PayloadItem[] }) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-1">{data.nome}</p>
        {data.temAvaliacao ? (
          <>
            <p className="text-sm text-[#173b5a]">
              Score Total: <span className="font-medium">{data.score_total?.toFixed(1)}</span>
            </p>
            {data.posicao && (
              <p className="text-xs text-muted-foreground">
                Posição: {data.posicao}º lugar
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-amber-600">
            Sem avaliação neste período
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function GraficoBarrasComparativo({ dados }: GraficoBarrasComparativoProps) {
  if (dados.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum aluno encontrado nesta turma.
      </div>
    );
  }

  // Preparar dados para o gráfico
  const dadosGrafico = dados.map((aluno) => ({
    ...aluno,
    // Usar 1.0 como placeholder visual para alunos sem avaliação
    displayValue: aluno.temAvaliacao ? aluno.score_total : 1.0
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#173b5a] rounded"></div>
          <span>Com avaliação</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#d1d5db] rounded border-2 border-dashed border-gray-400"></div>
          <span>Sem avaliação</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dadosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="nome"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#173b5a', fontSize: 11 }}
            interval={0}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: '#173b5a', fontSize: 12 }}
            label={{ value: 'Score Total', angle: -90, position: 'insideLeft', style: { fill: '#173b5a' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="displayValue" name="Score Total">
            {dadosGrafico.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.temAvaliacao ? '#173b5a' : '#d1d5db'}
                stroke={entry.temAvaliacao ? 'none' : '#9ca3af'}
                strokeWidth={entry.temAvaliacao ? 0 : 2}
                strokeDasharray={entry.temAvaliacao ? '' : '4 4'}
                opacity={entry.temAvaliacao ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

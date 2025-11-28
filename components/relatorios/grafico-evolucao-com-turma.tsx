'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

interface DadosEvolucao {
  mes_ano: string;
  score_total: number;
  media_turma?: number | null;
  media_movel?: number;
  evento?: { titulo: string; tipo: string };
}

interface GraficoEvolucaoComTurmaProps {
  dados: DadosEvolucao[];
}

interface PayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: PayloadItem[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: PayloadItem, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{Number(entry.value).toFixed(1)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function GraficoEvolucaoComTurma({ dados }: GraficoEvolucaoComTurmaProps) {
  const temMediaTurma = dados.some((d) => d.media_turma !== null && d.media_turma !== undefined);
  const temEventos = dados.some((d) => d.evento);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="mes_ano"
          tick={{ fill: '#173b5a', fontSize: 12 }}
          axisLine={{ stroke: '#173b5a' }}
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fill: '#173b5a', fontSize: 12 }}
          axisLine={{ stroke: '#173b5a' }}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          formatter={(value) => <span style={{ color: '#173b5a' }}>{value}</span>}
        />

        {/* Linha do aluno - sólida e destacada */}
        <Line
          type="monotone"
          dataKey="score_total"
          stroke="#173b5a"
          name="Aluno"
          strokeWidth={3}
          dot={{ fill: '#173b5a', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#173b5a' }}
        />

        {/* Linha da média da turma - pontilhada e cinza */}
        {temMediaTurma && (
          <Line
            type="monotone"
            dataKey="media_turma"
            stroke="#9ca3af"
            name="Média da Turma"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#9ca3af', strokeWidth: 1, r: 3 }}
            activeDot={{ r: 5, fill: '#9ca3af' }}
            connectNulls
          />
        )}

        {/* Linha de média móvel - verde */}
        {dados[0]?.media_movel !== undefined && (
          <Line
            type="monotone"
            dataKey="media_movel"
            stroke="#22c55e"
            name="Média Móvel (3 meses)"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
          />
        )}

        {/* Marcadores de eventos */}
        {temEventos && dados.map((item, idx) => {
          if (!item.evento) return null;
          return (
            <ReferenceDot
              key={`evento-${idx}`}
              x={item.mes_ano}
              y={item.score_total}
              r={8}
              fill="#a855f7"
              stroke="#fff"
              strokeWidth={2}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

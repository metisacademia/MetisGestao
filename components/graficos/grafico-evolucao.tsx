'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DadosEvolucao {
  mes_ano: string;
  score_total: number;
  score_fluencia: number;
  score_cultura: number;
  score_interpretacao: number;
  score_atencao: number;
  score_auto_percepcao: number;
}

interface GraficoEvolucaoProps {
  dados: DadosEvolucao[];
}

const CORES = {
  total: '#173b5a',
  fluencia: '#cda465',
  cultura: '#aa7552',
  interpretacao: '#323256',
  atencao: '#ce9976',
  auto_percepcao: '#0b0b28',
};

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

export function GraficoEvolucao({ dados }: GraficoEvolucaoProps) {
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
        <Line 
          type="monotone" 
          dataKey="score_total" 
          stroke={CORES.total} 
          name="Total" 
          strokeWidth={3}
          dot={{ fill: CORES.total, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: CORES.total }}
        />
        <Line 
          type="monotone" 
          dataKey="score_fluencia" 
          stroke={CORES.fluencia} 
          name="Fluência"
          strokeWidth={2}
          dot={{ fill: CORES.fluencia, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, fill: CORES.fluencia }}
        />
        <Line 
          type="monotone" 
          dataKey="score_cultura" 
          stroke={CORES.cultura} 
          name="Cultura"
          strokeWidth={2}
          dot={{ fill: CORES.cultura, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, fill: CORES.cultura }}
        />
        <Line 
          type="monotone" 
          dataKey="score_interpretacao" 
          stroke={CORES.interpretacao} 
          name="Interpretação"
          strokeWidth={2}
          dot={{ fill: CORES.interpretacao, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, fill: CORES.interpretacao }}
        />
        <Line 
          type="monotone" 
          dataKey="score_atencao" 
          stroke={CORES.atencao} 
          name="Atenção"
          strokeWidth={2}
          dot={{ fill: CORES.atencao, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, fill: CORES.atencao }}
        />
        <Line 
          type="monotone" 
          dataKey="score_auto_percepcao" 
          stroke={CORES.auto_percepcao} 
          name="Auto-percepção"
          strokeWidth={2}
          dot={{ fill: CORES.auto_percepcao, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, fill: CORES.auto_percepcao }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

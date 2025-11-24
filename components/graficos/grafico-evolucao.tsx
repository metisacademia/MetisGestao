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

export function GraficoEvolucao({ dados }: GraficoEvolucaoProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes_ano" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score_total" stroke="#8884d8" name="Total" strokeWidth={2} />
        <Line type="monotone" dataKey="score_fluencia" stroke="#82ca9d" name="Fluência" />
        <Line type="monotone" dataKey="score_cultura" stroke="#ffc658" name="Cultura" />
        <Line type="monotone" dataKey="score_interpretacao" stroke="#ff7c7c" name="Interpretação" />
        <Line type="monotone" dataKey="score_atencao" stroke="#a28cff" name="Atenção" />
        <Line type="monotone" dataKey="score_auto_percepcao" stroke="#ff8c42" name="Auto-percepção" />
      </LineChart>
    </ResponsiveContainer>
  );
}

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DadosBarras {
  nome: string;
  score: number;
}

interface GraficoBarrasProps {
  dados: DadosBarras[];
  titulo?: string;
}

export function GraficoBarras({ dados, titulo }: GraficoBarrasProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#8884d8" name={titulo || "Score"} />
      </BarChart>
    </ResponsiveContainer>
  );
}

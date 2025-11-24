'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

interface DadosRadar {
  dominio: string;
  aluno: number;
  media?: number;
}

interface GraficoRadarProps {
  dados: DadosRadar[];
  mostrarMedia?: boolean;
}

export function GraficoRadar({ dados, mostrarMedia = false }: GraficoRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={dados}>
        <PolarGrid />
        <PolarAngleAxis dataKey="dominio" />
        <PolarRadiusAxis domain={[0, 10]} />
        <Radar name="Aluno" dataKey="aluno" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        {mostrarMedia && (
          <Radar name="Média" dataKey="media" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        )}
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

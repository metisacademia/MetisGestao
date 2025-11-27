'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface DadosRadar {
  dominio: string;
  aluno: number;
  media?: number;
}

interface GraficoRadarProps {
  dados: DadosRadar[];
  mostrarMedia?: boolean;
}

const CORES = {
  aluno: '#173b5a',
  media: '#cda465',
};

interface PayloadItem {
  name: string;
  value: number;
  color: string;
  payload: DadosRadar;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: PayloadItem[] }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{data.dominio}</p>
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

export function GraficoRadar({ dados, mostrarMedia = false }: GraficoRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={dados} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="dominio" 
          tick={{ fill: '#173b5a', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          domain={[0, 10]} 
          tick={{ fill: '#173b5a', fontSize: 10 }}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar 
          name="Aluno" 
          dataKey="aluno" 
          stroke={CORES.aluno} 
          fill={CORES.aluno} 
          fillOpacity={0.5}
          strokeWidth={2}
        />
        {mostrarMedia && (
          <Radar 
            name="Média da Turma" 
            dataKey="media" 
            stroke={CORES.media} 
            fill={CORES.media} 
            fillOpacity={0.3}
            strokeWidth={2}
          />
        )}
        <Legend 
          formatter={(value) => <span style={{ color: '#173b5a' }}>{value}</span>}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

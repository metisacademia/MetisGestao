'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import type { MetricasVisiveis } from './toggle-metricas';

interface DadosEvolucao {
  mes_ano: string;
  score_total: number;
  score_fluencia: number;
  score_cultura: number;
  score_interpretacao: number;
  score_atencao: number;
  score_auto_percepcao: number;
  media_movel?: number;
  evento?: {
    titulo: string;
    tipo: string;
  };
}

interface GraficoEvolucaoAvancadoProps {
  dados: DadosEvolucao[];
  metricas: MetricasVisiveis;
}

const CORES = {
  total: '#173b5a',
  fluencia: '#cda465',
  cultura: '#aa7552',
  interpretacao: '#323256',
  atencao: '#ce9976',
  auto_percepcao: '#0b0b28',
  media_movel: '#22c55e',
};

interface PayloadItem {
  name: string;
  value: number;
  color: string;
  payload: DadosEvolucao;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: PayloadItem[]; label?: string }) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: PayloadItem, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{Number(entry.value).toFixed(1)}</span>
          </p>
        ))}
        {data?.evento && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-purple-700">
              Evento: {data.evento.titulo}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function GraficoEvolucaoAvancado({ dados, metricas }: GraficoEvolucaoAvancadoProps) {
  const eventosComIdx = dados.map((d, idx) => ({ ...d, idx })).filter(d => d.evento);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        
        {metricas.total && (
          <Line 
            type="monotone" 
            dataKey="score_total" 
            stroke={CORES.total} 
            name="Total" 
            strokeWidth={3}
            dot={{ fill: CORES.total, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: CORES.total }}
          />
        )}
        
        {metricas.media_movel && (
          <Line 
            type="monotone" 
            dataKey="media_movel" 
            stroke={CORES.media_movel} 
            name="Média Móvel (3m)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
        
        {metricas.fluencia && (
          <Line 
            type="monotone" 
            dataKey="score_fluencia" 
            stroke={CORES.fluencia} 
            name="Fluência"
            strokeWidth={2}
            dot={{ fill: CORES.fluencia, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: CORES.fluencia }}
          />
        )}
        
        {metricas.cultura && (
          <Line 
            type="monotone" 
            dataKey="score_cultura" 
            stroke={CORES.cultura} 
            name="Cultura"
            strokeWidth={2}
            dot={{ fill: CORES.cultura, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: CORES.cultura }}
          />
        )}
        
        {metricas.interpretacao && (
          <Line 
            type="monotone" 
            dataKey="score_interpretacao" 
            stroke={CORES.interpretacao} 
            name="Interpretação"
            strokeWidth={2}
            dot={{ fill: CORES.interpretacao, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: CORES.interpretacao }}
          />
        )}
        
        {metricas.atencao && (
          <Line 
            type="monotone" 
            dataKey="score_atencao" 
            stroke={CORES.atencao} 
            name="Atenção"
            strokeWidth={2}
            dot={{ fill: CORES.atencao, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: CORES.atencao }}
          />
        )}
        
        {metricas.auto_percepcao && (
          <Line 
            type="monotone" 
            dataKey="score_auto_percepcao" 
            stroke={CORES.auto_percepcao} 
            name="Auto-percepção"
            strokeWidth={2}
            dot={{ fill: CORES.auto_percepcao, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: CORES.auto_percepcao }}
          />
        )}

        {eventosComIdx.map((ev) => (
          <ReferenceDot
            key={ev.idx}
            x={ev.mes_ano}
            y={ev.score_total}
            r={8}
            fill="#9333ea"
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

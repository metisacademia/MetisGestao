'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DadosPresenca {
  mes_ano: string;
  presencas: number;
  total_sessoes: number;
  percentual: number;
}

interface GraficoPresencaProps {
  dados: DadosPresenca[];
  presencaMesAtual?: { presencas: number; total: number };
  presencaMedia6Meses?: number;
}

interface PayloadItem {
  payload: DadosPresenca;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: PayloadItem[]; label?: string }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-sm text-[#173b5a]">
          {data.presencas} de {data.total_sessoes} sessões
        </p>
        <p className="text-sm font-medium text-[#cda465]">
          {data.percentual.toFixed(0)}% de comparecimento
        </p>
      </div>
    );
  }
  return null;
}

export function GraficoPresenca({ dados, presencaMesAtual, presencaMedia6Meses }: GraficoPresencaProps) {
  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="mes_ano" 
              tick={{ fill: '#173b5a', fontSize: 11 }}
              axisLine={{ stroke: '#173b5a' }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#173b5a', fontSize: 11 }}
              axisLine={{ stroke: '#173b5a' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentual" radius={[4, 4, 0, 0]}>
              {dados.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.percentual >= 75 ? '#22c55e' : entry.percentual >= 50 ? '#cda465' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm">
        {presencaMesAtual && (
          <div className="bg-[#f8f1e7] px-3 py-2 rounded-lg">
            <span className="text-muted-foreground">Presenças no mês atual: </span>
            <span className="font-semibold text-[#173b5a]">
              {presencaMesAtual.presencas} de {presencaMesAtual.total} sessões
            </span>
          </div>
        )}
        {presencaMedia6Meses !== undefined && (
          <div className="bg-[#f8f1e7] px-3 py-2 rounded-lg">
            <span className="text-muted-foreground">Presença média (6 meses): </span>
            <span className="font-semibold text-[#173b5a]">
              {presencaMedia6Meses.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

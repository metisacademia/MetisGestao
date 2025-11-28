'use client';

import { Label } from '@/components/ui/label';

export type Periodo = '1m' | '3m' | '6m' | '12m' | 'all';

interface FiltroPeriodoProps {
  value: Periodo;
  onChange: (periodo: Periodo) => void;
}

const OPCOES: { value: Periodo; label: string }[] = [
  { value: '1m', label: 'Último mês' },
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '12m', label: 'Último ano' },
  { value: 'all', label: 'Todo o histórico' },
];

export function FiltroPeriodo({ value, onChange }: FiltroPeriodoProps) {
  return (
    <div className="space-y-2">
      <Label>Período</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Periodo)}
        className="border border-input rounded-md px-3 py-2 bg-white"
      >
        {OPCOES.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}

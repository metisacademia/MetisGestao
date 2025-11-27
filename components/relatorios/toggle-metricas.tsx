'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface MetricasVisiveis {
  total: boolean;
  fluencia: boolean;
  cultura: boolean;
  interpretacao: boolean;
  atencao: boolean;
  auto_percepcao: boolean;
  media_movel: boolean;
}

interface ToggleMetricasProps {
  metricas: MetricasVisiveis;
  onChange: (metricas: MetricasVisiveis) => void;
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

const LABELS = {
  total: 'Total',
  fluencia: 'Fluência',
  cultura: 'Cultura',
  interpretacao: 'Interpretação',
  atencao: 'Atenção',
  auto_percepcao: 'Auto-percepção',
  media_movel: 'Média Móvel (3 meses)',
};

export function ToggleMetricas({ metricas, onChange }: ToggleMetricasProps) {
  const handleChange = (key: keyof MetricasVisiveis) => {
    onChange({ ...metricas, [key]: !metricas[key] });
  };

  return (
    <div className="flex flex-wrap gap-4">
      {(Object.keys(metricas) as Array<keyof MetricasVisiveis>).map((key) => (
        <div key={key} className="flex items-center space-x-2">
          <Checkbox
            id={`metric-${key}`}
            checked={metricas[key]}
            onCheckedChange={() => handleChange(key)}
          />
          <Label
            htmlFor={`metric-${key}`}
            className="text-sm cursor-pointer flex items-center gap-2"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CORES[key] }}
            />
            {LABELS[key]}
          </Label>
        </div>
      ))}
    </div>
  );
}

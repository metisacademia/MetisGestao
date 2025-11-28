'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function TurmaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const mesAtual = searchParams.get('mes') || String(new Date().getMonth() + 1);
  const anoAtual = searchParams.get('ano') || String(new Date().getFullYear());

  const handleFilterChange = (key: 'mes' | 'ano', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const meses = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  return (
    <div className="flex gap-4 bg-card p-4 rounded-lg border shadow-sm mb-6">
      <div className="space-y-1">
        <Label htmlFor="mes-filter">Mês de Referência</Label>
        <Select value={mesAtual} onValueChange={(v) => handleFilterChange('mes', v)}>
          <SelectTrigger id="mes-filter" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {meses.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="ano-filter">Ano</Label>
        <Select value={anoAtual} onValueChange={(v) => handleFilterChange('ano', v)}>
          <SelectTrigger id="ano-filter" className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

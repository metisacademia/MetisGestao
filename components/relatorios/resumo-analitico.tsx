'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ResumoAnaliticoProps {
  texto: string;
}

export function ResumoAnalitico({ texto }: ResumoAnaliticoProps) {
  if (!texto) return null;

  return (
    <Card className="bg-[#f8f1e7] border-[#cda465]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-[#173b5a]">
          <FileText className="w-5 h-5" />
          Resumo Analítico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#173b5a] leading-relaxed">{texto}</p>
      </CardContent>
    </Card>
  );
}

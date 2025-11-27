'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Home, Users, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Evento {
  id: string;
  data: string;
  titulo: string;
  descricao?: string;
  tipo: 'SAUDE' | 'ROTINA' | 'TURMA' | 'OUTROS';
}

interface LinhaTempoEventosProps {
  eventos: Evento[];
}

const TIPO_CONFIG = {
  SAUDE: { icon: Heart, cor: 'bg-red-100 text-red-700', label: 'Saúde' },
  ROTINA: { icon: Home, cor: 'bg-blue-100 text-blue-700', label: 'Rotina' },
  TURMA: { icon: Users, cor: 'bg-green-100 text-green-700', label: 'Turma' },
  OUTROS: { icon: MoreHorizontal, cor: 'bg-gray-100 text-gray-700', label: 'Outros' },
};

export function LinhaTempoEventos({ eventos }: LinhaTempoEventosProps) {
  if (!eventos || eventos.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5" />
          Eventos Relevantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4">
            {eventos.map((evento) => {
              const config = TIPO_CONFIG[evento.tipo];
              const Icon = config.icon;
              return (
                <div key={evento.id} className="relative flex gap-4 pl-10">
                  <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${config.cor}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#173b5a]">{evento.titulo}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(evento.data), "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    {evento.descricao && (
                      <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                    )}
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${config.cor}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

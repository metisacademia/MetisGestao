'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface Evolucao {
  mes_ano: string;
  score_total: number;
  score_fluencia: number;
  score_cultura: number;
  score_interpretacao: number;
  score_atencao: number;
  score_auto_percepcao: number;
}

interface RadarData {
  dominio: string;
  aluno: number;
}

interface Recomendacao {
  dominio: string;
  texto: string;
}

interface RelatorioData {
  aluno: {
    id: string;
    nome: string;
    turma: string;
    moderadora: string;
  };
  periodo: {
    inicio: string;
    fim: string;
  };
  evolucao: Evolucao[];
  radar: RadarData[];
  tendencia: {
    direcao: 'melhora' | 'estavel' | 'queda';
    variacao: number;
    frase: string;
    scoreAtual: number;
  };
  presenca: {
    participou: number;
    total: number;
    percentual: number;
    status: 'verde' | 'amarelo' | 'vermelho';
  };
  resumo: string;
  recomendacoes: Recomendacao[];
}

const LEGENDAS_DOMINIOS: Record<string, string> = {
  'Fluência': 'agilidade para lembrar e falar palavras',
  'Cultura': 'repertório de conhecimentos e memórias gerais',
  'Atenção': 'capacidade de focar e notar detalhes',
  'Interpretação': 'compreensão de textos e situações',
  'Auto-percepção': 'consciência sobre sua própria memória',
};

export default function MeuRelatorioPage() {
  const [data, setData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const response = await fetch('/api/aluno/meu-relatorio');
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Erro ao carregar relatório');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Não foi possível carregar seu relatório. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-[#173b5a] animate-pulse" />
          <span className="text-[#173b5a] text-lg">Carregando seu relatório...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-[#173b5a]">{error || 'Erro ao carregar dados'}</p>
        </Card>
      </div>
    );
  }

  const TendenciaIcon = data.tendencia.direcao === 'melhora' 
    ? TrendingUp 
    : data.tendencia.direcao === 'queda' 
      ? TrendingDown 
      : Minus;

  const tendenciaColor = data.tendencia.direcao === 'melhora'
    ? 'text-green-600'
    : data.tendencia.direcao === 'queda'
      ? 'text-orange-500'
      : 'text-[#173b5a]';

  const presencaColor = data.presenca.status === 'verde'
    ? 'bg-green-500'
    : data.presenca.status === 'amarelo'
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="space-y-6">
      <Card className="bg-white border-none shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#173b5a] to-[#2a5580] p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-[#cda465]" />
            <div>
              <h1 className="text-2xl font-bold">{data.aluno.nome}</h1>
              <p className="text-[#cda465] text-sm">{data.aluno.turma}</p>
            </div>
          </div>
          {data.periodo.inicio && data.periodo.fim && (
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>Período: {data.periodo.inicio} – {data.periodo.fim}</span>
            </div>
          )}
          <p className="mt-4 text-sm text-[#f8f1e7]/90 italic">
            Este painel mostra a trajetória da sua mente na Métis, ao longo do período acima.
          </p>
        </div>
      </Card>

      <Card className="bg-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#173b5a] flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#cda465]" />
            Evolução Global da Mente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#173b5a]">
                  {data.tendencia.scoreAtual.toFixed(1)}
                </span>
                <span className="text-lg text-[#173b5a]/60">/10</span>
              </div>
              <p className="text-sm text-[#173b5a]/70 mt-1">Pontuação atual</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 ${tendenciaColor}`}>
                <TendenciaIcon className="w-6 h-6" />
                <span className="font-semibold">
                  {data.tendencia.direcao === 'melhora' && '↑'}
                  {data.tendencia.direcao === 'queda' && '↓'}
                  {data.tendencia.direcao === 'estavel' && '→'}
                  {' '}vs início
                </span>
              </div>
              <p className="text-sm text-[#173b5a]/70 mt-1 max-w-[200px]">
                {data.tendencia.frase}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.evolucao.length > 0 && (
        <Card className="bg-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-[#173b5a]">
              Sua Trajetória ao Longo do Tempo
            </CardTitle>
            <p className="text-sm text-[#173b5a]/60">
              Acompanhe como sua pontuação evoluiu desde o início
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={data.evolucao} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #cda465',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#173b5a', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score_total" 
                    stroke="#173b5a" 
                    name="Pontuação" 
                    strokeWidth={3}
                    dot={{ fill: '#173b5a', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#cda465' }}
                  />
                  {data.evolucao.length > 0 && (
                    <ReferenceDot
                      x={data.evolucao[0].mes_ano}
                      y={data.evolucao[0].score_total}
                      r={8}
                      fill="#cda465"
                      stroke="#173b5a"
                      strokeWidth={2}
                    />
                  )}
                  {data.evolucao.length > 1 && (
                    <ReferenceDot
                      x={data.evolucao[data.evolucao.length - 1].mes_ano}
                      y={data.evolucao[data.evolucao.length - 1].score_total}
                      r={8}
                      fill="#22c55e"
                      stroke="#173b5a"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#cda465] border-2 border-[#173b5a]"></div>
                <span className="text-[#173b5a]">Aqui você começou</span>
              </div>
              {data.evolucao.length > 1 && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-[#173b5a]"></div>
                  <span className="text-[#173b5a]">Onde você está hoje</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {data.radar.length > 0 && (
        <Card className="bg-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-[#173b5a]">
              Suas Habilidades Cognitivas
            </CardTitle>
            <p className="text-sm text-[#173b5a]/60">
              Como você está em cada área avaliada
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data.radar} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="dominio" 
                    tick={{ fill: '#173b5a', fontSize: 11 }}
                  />
                  <PolarRadiusAxis 
                    domain={[0, 10]} 
                    tick={{ fill: '#173b5a', fontSize: 10 }}
                    tickFormatter={(value) => value.toFixed(0)}
                  />
                  <Radar 
                    name="Você" 
                    dataKey="aluno" 
                    stroke="#173b5a" 
                    fill="#173b5a" 
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Legend 
                    formatter={(value) => <span style={{ color: '#173b5a' }}>{value}</span>}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 bg-[#f8f1e7] rounded-lg p-4">
              <p className="text-sm font-medium text-[#173b5a] mb-3">O que cada área significa:</p>
              {Object.entries(LEGENDAS_DOMINIOS).map(([dominio, legenda]) => (
                <div key={dominio} className="flex items-start gap-2 text-sm">
                  <span className="font-semibold text-[#173b5a] min-w-[100px]">{dominio}:</span>
                  <span className="text-[#173b5a]/80">{legenda}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#173b5a] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#cda465]" />
            Resumo da Sua Jornada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#173b5a] leading-relaxed">
            {data.resumo}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#173b5a] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#cda465]" />
            Sua Presença nas Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${presencaColor}`}></div>
            <p className="text-[#173b5a]">
              Você participou de <strong>{data.presenca.participou}</strong> de{' '}
              <strong>{data.presenca.total}</strong> encontros neste período
              {data.presenca.total > 0 && (
                <span className="text-[#173b5a]/60"> ({data.presenca.percentual}%)</span>
              )}
            </p>
          </div>
          <div className="mt-4 p-4 bg-[#f8f1e7] rounded-lg">
            <p className="text-sm text-[#173b5a]/80 italic">
              A regularidade nos encontros potencializa os benefícios para sua mente. 
              Cada sessão é uma oportunidade de exercitar e fortalecer suas habilidades cognitivas.
            </p>
          </div>
        </CardContent>
      </Card>

      {data.recomendacoes.length > 0 && (
        <Card className="bg-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#173b5a] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#cda465]" />
              Convites para o Seu Dia a Dia
            </CardTitle>
            <p className="text-sm text-[#173b5a]/60">
              Algumas sugestões para exercitar sua mente entre os encontros
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.recomendacoes.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#cda465] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-medium">{idx + 1}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#173b5a]">{rec.dominio}: </span>
                    <span className="text-[#173b5a]/80">{rec.texto}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#173b5a]/5 border border-[#173b5a]/20 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#173b5a]/70 mt-0.5 flex-shrink-0" />
            <div className="space-y-3 text-sm text-[#173b5a]/70">
              <p>
                <strong>Aviso importante:</strong> Este relatório não substitui avaliação médica ou neurológica. 
                Ele reflete apenas as observações realizadas durante as atividades na Métis e tem caráter 
                exclusivamente informativo e educacional.
              </p>
              <p>
                Se tiver dúvidas sobre qualquer aspecto deste relatório, converse com sua moderadora{' '}
                <strong>{data.aluno.moderadora}</strong>. Ela terá prazer em ajudar você a entender 
                melhor sua trajetória.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

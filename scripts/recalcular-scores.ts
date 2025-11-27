import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface RegraPontuacaoFaixas {
  tipo: 'faixas';
  faixas: Array<{ ate?: number; acima?: number; pontos: number }>;
}

interface RegraPontuacaoSimNao {
  tipo: 'sim_nao';
  sim: number;
  nao: number;
}

interface RegraPontuacaoMapa {
  tipo: 'mapa';
  mapa: Record<string, number>;
}

interface RegraPontuacaoAlternativaCorreta {
  tipo: 'alternativa_correta';
  correta: string;
  pontos_correta: number;
  pontos_errada: number;
}

type RegraPontuacao =
  | RegraPontuacaoFaixas
  | RegraPontuacaoSimNao
  | RegraPontuacaoMapa
  | RegraPontuacaoAlternativaCorreta;

function calcularPontuacaoMaximaItem(regra_pontuacao_json: string): number {
  try {
    const regra: RegraPontuacao = JSON.parse(regra_pontuacao_json);
    switch (regra.tipo) {
      case 'faixas':
        return Math.max(...regra.faixas.map((f) => f.pontos));
      case 'sim_nao':
        return Math.max(regra.sim, regra.nao);
      case 'mapa':
        return Math.max(...Object.values(regra.mapa));
      case 'alternativa_correta':
        return Math.max(regra.pontos_correta, regra.pontos_errada);
      default:
        return 0;
    }
  } catch {
    return 0;
  }
}

function calcularPontuacaoItem(valor_bruto: string, regra_pontuacao_json: string): number {
  try {
    const regra: RegraPontuacao = JSON.parse(regra_pontuacao_json);
    switch (regra.tipo) {
      case 'faixas': {
        const valor_numerico = parseFloat(valor_bruto);
        if (isNaN(valor_numerico)) return 0;
        for (const faixa of regra.faixas) {
          if (faixa.ate !== undefined && valor_numerico <= faixa.ate) return faixa.pontos;
          if (faixa.acima !== undefined && valor_numerico > faixa.acima) return faixa.pontos;
        }
        return 0;
      }
      case 'sim_nao': {
        const valor = valor_bruto.toLowerCase().trim();
        if (valor === 'sim' || valor === 's' || valor === 'true' || valor === '1') {
          return regra.sim;
        }
        return regra.nao;
      }
      case 'mapa':
        return regra.mapa[valor_bruto] ?? 0;
      case 'alternativa_correta': {
        const valor = valor_bruto.toUpperCase().trim();
        return valor === regra.correta.toUpperCase() ? regra.pontos_correta : regra.pontos_errada;
      }
      default:
        return 0;
    }
  } catch {
    return 0;
  }
}

async function main() {
  console.log('Iniciando recálculo de scores...');

  const avaliacoes = await prisma.avaliacao.findMany({
    where: { status: 'CONCLUIDA' },
    include: {
      respostas: { include: { item: true } },
      template: { include: { itens: { include: { dominio: true } } } },
    },
  });

  console.log(`Encontradas ${avaliacoes.length} avaliações concluídas`);

  for (const avaliacao of avaliacoes) {
    const pontuacaoMaximaPorDominio: Record<string, number> = {};
    const pontuacaoTotalPorDominio: Record<string, number> = {};

    for (const item of avaliacao.template.itens) {
      const maxItem = calcularPontuacaoMaximaItem(item.regra_pontuacao);
      pontuacaoMaximaPorDominio[item.dominioId] = (pontuacaoMaximaPorDominio[item.dominioId] || 0) + maxItem;
      pontuacaoTotalPorDominio[item.dominioId] = 0;
    }

    for (const resposta of avaliacao.respostas) {
      const pontos = calcularPontuacaoItem(resposta.valor_bruto, resposta.item.regra_pontuacao);
      pontuacaoTotalPorDominio[resposta.dominioId] = (pontuacaoTotalPorDominio[resposta.dominioId] || 0) + pontos;
    }

    const scores: Record<string, number> = {
      score_fluencia: 0,
      score_cultura: 0,
      score_interpretacao: 0,
      score_atencao: 0,
      score_auto_percepcao: 0,
      score_fluencia_0a10: 0,
      score_cultura_0a10: 0,
      score_interpretacao_0a10: 0,
      score_atencao_0a10: 0,
      score_auto_percepcao_0a10: 0,
    };

    for (const item of avaliacao.template.itens) {
      const dominio = item.dominio;
      const dominioId = dominio.id;
      const nomeDominio = dominio.nome.toLowerCase();
      const total = pontuacaoTotalPorDominio[dominioId] || 0;
      const max = pontuacaoMaximaPorDominio[dominioId] || 1;
      const score_0a10 = max > 0 ? Math.min((total / max) * 10, 10) : 0;

      if (nomeDominio.includes('fluência') || nomeDominio.includes('fluencia')) {
        scores.score_fluencia = total;
        scores.score_fluencia_0a10 = score_0a10;
      } else if (nomeDominio.includes('cultura')) {
        scores.score_cultura = total;
        scores.score_cultura_0a10 = score_0a10;
      } else if (nomeDominio.includes('interpretação') || nomeDominio.includes('interpretacao')) {
        scores.score_interpretacao = total;
        scores.score_interpretacao_0a10 = score_0a10;
      } else if (nomeDominio.includes('atenção') || nomeDominio.includes('atencao')) {
        scores.score_atencao = total;
        scores.score_atencao_0a10 = score_0a10;
      } else if (nomeDominio.includes('auto')) {
        scores.score_auto_percepcao = total;
        scores.score_auto_percepcao_0a10 = score_0a10;
      }
    }

    const scoreValues = Object.values(scores).filter((_, i) => i >= 5 && i < 10);
    const validScores = scoreValues.filter((s) => s > 0);
    scores.score_total = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;

    await prisma.avaliacao.update({
      where: { id: avaliacao.id },
      data: {
        score_total: scores.score_total,
        score_fluencia: scores.score_fluencia,
        score_cultura: scores.score_cultura,
        score_interpretacao: scores.score_interpretacao,
        score_atencao: scores.score_atencao,
        score_auto_percepcao: scores.score_auto_percepcao,
        score_fluencia_0a10: scores.score_fluencia_0a10,
        score_cultura_0a10: scores.score_cultura_0a10,
        score_interpretacao_0a10: scores.score_interpretacao_0a10,
        score_atencao_0a10: scores.score_atencao_0a10,
        score_auto_percepcao_0a10: scores.score_auto_percepcao_0a10,
      },
    });

    console.log(`Avaliação ${avaliacao.id} atualizada - Scores: Fluência=${scores.score_fluencia_0a10.toFixed(1)}, Cultura=${scores.score_cultura_0a10.toFixed(1)}, Interpretação=${scores.score_interpretacao_0a10.toFixed(1)}, Atenção=${scores.score_atencao_0a10.toFixed(1)}, Auto-percepção=${scores.score_auto_percepcao_0a10.toFixed(1)}`);
  }

  console.log('Recálculo concluído!');
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

interface RegraPontuacaoFaixas {
  tipo: 'faixas';
  faixas: Array<{
    ate?: number;
    acima?: number;
    pontos: number;
  }>;
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

export function calcularPontuacaoItem(
  valor_bruto: string,
  regra_pontuacao_json: string
): number {
  try {
    const regra: RegraPontuacao = JSON.parse(regra_pontuacao_json);

    switch (regra.tipo) {
      case 'faixas': {
        const valor_numerico = parseFloat(valor_bruto);
        if (isNaN(valor_numerico)) return 0;

        for (const faixa of regra.faixas) {
          if (faixa.ate !== undefined && valor_numerico <= faixa.ate) {
            return faixa.pontos;
          }
          if (faixa.acima !== undefined && valor_numerico > faixa.acima) {
            return faixa.pontos;
          }
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

      case 'mapa': {
        return regra.mapa[valor_bruto] ?? 0;
      }

      case 'alternativa_correta': {
        const valor = valor_bruto.toUpperCase().trim();
        return valor === regra.correta.toUpperCase()
          ? regra.pontos_correta
          : regra.pontos_errada;
      }

      default:
        console.error('Tipo de regra de pontuação desconhecido:', (regra as any).tipo);
        return 0;
    }
  } catch (error) {
    console.error('Erro ao calcular pontuação:', error);
    return 0;
  }
}

interface RespostaComDominio {
  dominioId: string;
  pontuacao_item: number;
}

interface ScoresPorDominio {
  [dominioId: string]: {
    total: number;
    pontuacao_maxima: number;
    score_0a10: number;
  };
}

export function calcularScoresPorDominio(
  respostas: RespostaComDominio[],
  dominios: Array<{ id: string; pontuacao_maxima: number }>
): ScoresPorDominio {
  const scores: ScoresPorDominio = {};

  dominios.forEach((dominio) => {
    scores[dominio.id] = {
      total: 0,
      pontuacao_maxima: dominio.pontuacao_maxima,
      score_0a10: 0,
    };
  });

  respostas.forEach((resposta) => {
    if (scores[resposta.dominioId]) {
      scores[resposta.dominioId].total += resposta.pontuacao_item;
    }
  });

  Object.keys(scores).forEach((dominioId) => {
    const dominio = scores[dominioId];
    if (dominio.total > 0 && dominio.pontuacao_maxima > 0) {
      dominio.score_0a10 = (dominio.total / dominio.pontuacao_maxima) * 10;
    }
  });

  return scores;
}

export function calcularScoreTotal(scoresPorDominio: ScoresPorDominio): number {
  const scores = Object.values(scoresPorDominio).map((s) => s.score_0a10);
  if (scores.length === 0) return 0;
  return scores.reduce((acc, score) => acc + score, 0) / scores.length;
}

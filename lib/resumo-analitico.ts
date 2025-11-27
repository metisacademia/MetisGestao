interface DadosEvolucao {
  score_fluencia: number;
  score_cultura: number;
  score_interpretacao: number;
  score_atencao: number;
  score_auto_percepcao: number;
  score_total: number;
}

interface DadosPresenca {
  percentual: number;
}

interface VariacaoDominio {
  dominio: string;
  variacao: number;
  tendencia: 'melhora' | 'estavel' | 'queda';
}

interface ParametrosResumo {
  evolucao: DadosEvolucao[];
  variacoes: VariacaoDominio[];
  presencas?: DadosPresenca[];
  periodoMeses: number;
}

function classificarVariacao(variacao: number): 'melhora' | 'estavel' | 'queda' {
  if (variacao > 1.0) return 'melhora';
  if (variacao < -1.0) return 'queda';
  return 'estavel';
}

function formatarListaDominios(dominios: string[]): string {
  if (dominios.length === 0) return '';
  if (dominios.length === 1) return dominios[0];
  if (dominios.length === 2) return `${dominios[0]} e ${dominios[1]}`;
  const ultimo = dominios.pop();
  return `${dominios.join(', ')} e ${ultimo}`;
}

export function gerarResumoAnalitico({ evolucao, variacoes, presencas, periodoMeses }: ParametrosResumo): string {
  if (evolucao.length === 0) {
    return 'Ainda não há avaliações suficientes para gerar um resumo analítico.';
  }

  const partes: string[] = [];
  const periodoTexto = periodoMeses === 3 ? 'nos últimos 3 meses' :
    periodoMeses === 6 ? 'nos últimos 6 meses' :
    periodoMeses === 12 ? 'no último ano' :
    'no período analisado';

  const melhorias = variacoes.filter(v => v.tendencia === 'melhora').map(v => v.dominio);
  const quedas = variacoes.filter(v => v.tendencia === 'queda').map(v => v.dominio);
  const estaveis = variacoes.filter(v => v.tendencia === 'estavel').map(v => v.dominio);

  if (melhorias.length > 0) {
    const dominiosMelhora = formatarListaDominios([...melhorias]);
    partes.push(`${periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)}, o aluno apresentou melhora consistente em ${dominiosMelhora}`);
  }

  if (estaveis.length > 0 && partes.length > 0) {
    const dominiosEstaveis = formatarListaDominios([...estaveis]);
    partes.push(`mantendo estabilidade em ${dominiosEstaveis}`);
  } else if (estaveis.length > 0) {
    const dominiosEstaveis = formatarListaDominios([...estaveis]);
    partes.push(`${periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)}, o aluno manteve desempenho estável em ${dominiosEstaveis}`);
  }

  if (quedas.length > 0) {
    const dominiosQueda = formatarListaDominios([...quedas]);
    if (partes.length > 0) {
      partes.push(`Observa-se leve queda em ${dominiosQueda}`);
    } else {
      partes.push(`${periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)}, observa-se queda no desempenho em ${dominiosQueda}`);
    }
  }

  if (presencas && presencas.length > 0) {
    const mediaPresenca = presencas.reduce((sum, p) => sum + p.percentual, 0) / presencas.length;
    
    if (mediaPresenca < 70 && quedas.length > 0) {
      partes.push('coincidindo com redução na frequência às sessões no período');
    } else if (mediaPresenca >= 85) {
      partes.push('O aluno demonstrou excelente engajamento, com presença regular nas sessões');
    } else if (mediaPresenca < 60) {
      partes.push('A frequência reduzida às sessões pode estar impactando o desenvolvimento cognitivo');
    }
  }

  if (partes.length === 0) {
    return 'O aluno apresenta desempenho dentro dos parâmetros esperados, sem variações significativas no período.';
  }

  let texto = partes.join('. ');
  if (!texto.endsWith('.')) {
    texto += '.';
  }

  return texto;
}

export function calcularVariacoes(evolucao: DadosEvolucao[], mesAtual: number): VariacaoDominio[] {
  if (evolucao.length < 2) {
    return [];
  }

  const ultimo = evolucao[evolucao.length - 1];
  const indicePeriodo = Math.max(0, evolucao.length - mesAtual - 1);
  const referencia = evolucao[indicePeriodo] || evolucao[0];

  const dominios = [
    { key: 'score_fluencia', nome: 'Fluência' },
    { key: 'score_cultura', nome: 'Cultura' },
    { key: 'score_interpretacao', nome: 'Interpretação' },
    { key: 'score_atencao', nome: 'Atenção' },
    { key: 'score_auto_percepcao', nome: 'Auto-percepção' },
    { key: 'score_total', nome: 'Total' },
  ];

  return dominios.map(d => {
    const atual = ultimo[d.key as keyof DadosEvolucao] || 0;
    const anterior = referencia[d.key as keyof DadosEvolucao] || 0;
    const variacao = atual - anterior;
    return {
      dominio: d.nome,
      variacao,
      tendencia: classificarVariacao(variacao),
    };
  });
}

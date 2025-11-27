interface DadosRadar {
  dominio: string;
  aluno: number;
}

interface Recomendacao {
  dominio: string;
  texto: string;
}

const RECOMENDACOES_POR_DOMINIO: Record<string, string[]> = {
  'Fluência': [
    'Que tal experimentar jogos de palavras como caça-palavras ou palavras cruzadas? Eles ajudam a deixar as palavras mais "na ponta da língua".',
    'Contar histórias do seu dia para alguém próximo pode ser um ótimo exercício para a fluência verbal.',
    'Ouvir músicas e tentar cantar junto ajuda a exercitar a memória de palavras de forma leve e divertida.',
  ],
  'Cultura': [
    'Assistir a documentários ou programas sobre temas variados pode ampliar seu repertório de conhecimentos gerais.',
    'Conversar sobre notícias e acontecimentos com amigos ou familiares ajuda a manter a mente ativa e informada.',
    'Visitar museus, exposições ou eventos culturais pode ser uma forma prazerosa de enriquecer sua bagagem cultural.',
  ],
  'Atenção': [
    'Jogos como quebra-cabeças ou jogo dos 7 erros são ótimos para exercitar a atenção aos detalhes.',
    'Praticar atividades manuais como artesanato, jardinagem ou culinária exige foco e pode ser muito relaxante.',
    'Experimente fazer uma coisa de cada vez, prestando atenção total naquela atividade.',
  ],
  'Interpretação': [
    'Ler um pouco todos os dias, mesmo que sejam textos curtos, ajuda a manter a compreensão afiada.',
    'Discutir o que você leu ou assistiu com outras pessoas ajuda a organizar suas interpretações.',
    'Ouvir podcasts ou audiobooks e depois resumir mentalmente o que entendeu é um ótimo exercício.',
  ],
  'Auto-percepção': [
    'Anotar compromissos e tarefas em uma agenda pode ajudar a organizar a memória do dia a dia.',
    'Fazer pausas durante o dia para refletir sobre como você está se sentindo pode aumentar sua consciência sobre si mesmo.',
    'Pedir feedback de pessoas próximas sobre como você está pode trazer novas perspectivas sobre sua memória.',
  ],
};

export function gerarRecomendacoesAluno(radar: DadosRadar[], quantidade: number = 3): Recomendacao[] {
  if (!radar || radar.length === 0) {
    return [];
  }

  const dominiosOrdenados = [...radar].sort((a, b) => a.aluno - b.aluno);
  
  const dominiosMaisFracos = dominiosOrdenados.slice(0, quantidade);
  
  const recomendacoes: Recomendacao[] = [];
  
  for (const dominio of dominiosMaisFracos) {
    const recomendacoesDominio = RECOMENDACOES_POR_DOMINIO[dominio.dominio];
    if (recomendacoesDominio && recomendacoesDominio.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * recomendacoesDominio.length);
      recomendacoes.push({
        dominio: dominio.dominio,
        texto: recomendacoesDominio[indiceAleatorio],
      });
    }
  }
  
  return recomendacoes;
}

export function gerarResumoAmigavel(
  evolucao: { score_total: number }[],
  radar: DadosRadar[]
): string {
  if (!evolucao || evolucao.length === 0) {
    return 'Ainda não temos avaliações suficientes para gerar um resumo. Continue participando das atividades!';
  }

  const primeiroScore = evolucao[0].score_total;
  const ultimoScore = evolucao[evolucao.length - 1].score_total;
  const diferenca = ultimoScore - primeiroScore;

  const dominiosFortes = radar
    .filter(d => d.aluno >= 7)
    .map(d => d.dominio);
  
  let resumo = '';

  if (diferenca > 1) {
    resumo = 'Você está em uma trajetória positiva! ';
  } else if (diferenca < -1) {
    resumo = 'Mesmo com algumas oscilações recentes, lembre-se: oscilar é esperado e faz parte do processo. ';
  } else {
    resumo = 'Seu desempenho tem se mantido estável, o que também é um bom sinal. ';
  }

  if (dominiosFortes.length > 0) {
    if (dominiosFortes.length === 1) {
      resumo += `Você demonstra força especial em ${dominiosFortes[0]}. `;
    } else {
      const ultimos = dominiosFortes.pop();
      resumo += `Você demonstra força especial em ${dominiosFortes.join(', ')} e ${ultimos}. `;
    }
  }

  resumo += 'Continue participando regularmente das atividades – cada encontro é uma oportunidade de cuidar da sua mente!';

  return resumo;
}

export function calcularTendencia(evolucao: { score_total: number }[]): {
  direcao: 'melhora' | 'estavel' | 'queda';
  variacao: number;
  frase: string;
} {
  if (!evolucao || evolucao.length < 2) {
    return {
      direcao: 'estavel',
      variacao: 0,
      frase: 'Ainda estamos conhecendo sua trajetória.',
    };
  }

  const primeiroScore = evolucao[0].score_total;
  const ultimoScore = evolucao[evolucao.length - 1].score_total;
  const diferenca = ultimoScore - primeiroScore;

  if (diferenca > 0.5) {
    return {
      direcao: 'melhora',
      variacao: diferenca,
      frase: 'Você está evoluindo positivamente desde o início!',
    };
  } else if (diferenca < -0.5) {
    return {
      direcao: 'queda',
      variacao: diferenca,
      frase: 'Algumas oscilações são normais. O importante é manter a regularidade.',
    };
  } else {
    return {
      direcao: 'estavel',
      variacao: diferenca,
      frase: 'Seu desempenho tem se mantido consistente.',
    };
  }
}

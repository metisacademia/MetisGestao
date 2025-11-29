import { PrismaPg } from '@prisma/adapter-pg';
import {
  PerfilUsuario,
  Prisma,
  PrismaClient,
  TipoResposta,
  Turno,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable must be provided to run the seed');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const adminPassword = '$2b$10$LKZVbjXLwfmB7lFk8FNnFuM3JcDje4Xc5QQ4KVXoT7skX0dQ5mU2m';
  const modPassword = '$2b$10$fcoWARp4y3qKMaAz29a07.7WwPgqhej65r1wqGTT16GvVj1rBzyFi';

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@metis.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@metis.com',
      senha_hash: adminPassword,
      perfil: PerfilUsuario.ADMIN,
    },
  });
  console.log('✓ Admin criado:', admin.email);

  const moderador = await prisma.usuario.upsert({
    where: { email: 'moderador@metis.com' },
    update: {},
    create: {
      nome: 'Maria Moderadora',
      email: 'moderador@metis.com',
      senha_hash: modPassword,
      perfil: PerfilUsuario.MODERADOR,
    },
  });
  console.log('✓ Moderador criado:', moderador.email);

  let turmaAurora = await prisma.turma.findFirst({
    where: { nome_turma: 'Aurora – Segunda 18h' },
  });
  if (!turmaAurora) {
    turmaAurora = await prisma.turma.create({
      data: {
        nome_turma: 'Aurora – Segunda 18h',
        dia_semana: 'Segunda-feira',
        horario: '18:00',
        turno: Turno.NOITE,
        moderadorId: moderador.id,
      },
    });
    console.log('✓ Turma criada:', turmaAurora.nome_turma);
  } else {
    console.log('✓ Turma já existe:', turmaAurora.nome_turma);
  }

  let turmaVespera = await prisma.turma.findFirst({
    where: { nome_turma: 'Véspera – Quarta 15h' },
  });
  if (!turmaVespera) {
    turmaVespera = await prisma.turma.create({
      data: {
        nome_turma: 'Véspera – Quarta 15h',
        dia_semana: 'Quarta-feira',
        horario: '15:00',
        turno: Turno.TARDE,
        moderadorId: moderador.id,
      },
    });
    console.log('✓ Turma criada:', turmaVespera.nome_turma);
  } else {
    console.log('✓ Turma já existe:', turmaVespera.nome_turma);
  }

  const alunos = [
    { nome: 'João Silva', turmaId: turmaAurora.id },
    { nome: 'Maria Santos', turmaId: turmaAurora.id },
    { nome: 'Pedro Oliveira', turmaId: turmaAurora.id },
    { nome: 'Ana Costa', turmaId: turmaVespera.id },
    { nome: 'Carlos Souza', turmaId: turmaVespera.id },
  ];

  for (const alunoData of alunos) {
    const existing = await prisma.aluno.findFirst({
      where: { nome: alunoData.nome, turmaId: alunoData.turmaId },
    });
    if (!existing) {
      await prisma.aluno.create({
        data: {
          ...alunoData,
          observacoes: 'Aluno participativo',
        },
      });
    }
  }
  console.log(`✓ ${alunos.length} alunos verificados/criados`);

  const dominios = [
    {
      nome: 'Fluência verbal',
      descricao: 'Capacidade de produzir palavras rapidamente',
      pontuacao_maxima: 10,
    },
    {
      nome: 'Cultura & memória semântica',
      descricao: 'Conhecimento geral e memória de fatos',
      pontuacao_maxima: 10,
    },
    {
      nome: 'Interpretação',
      descricao: 'Compreensão e análise de informações',
      pontuacao_maxima: 10,
    },
    {
      nome: 'Atenção visual',
      descricao: 'Foco e concentração em estímulos visuais',
      pontuacao_maxima: 10,
    },
    {
      nome: 'Auto-percepção',
      descricao: 'Consciência sobre o próprio desempenho',
      pontuacao_maxima: 10,
    },
  ];

  const dominiosMap: Record<string, string> = {};
  for (const dominioData of dominios) {
    let dominio = await prisma.dominioCognitivo.findFirst({
      where: { nome: dominioData.nome },
    });
    if (!dominio) {
      dominio = await prisma.dominioCognitivo.create({
        data: dominioData,
      });
    }
    dominiosMap[dominioData.nome] = dominio.id;
  }
  console.log(`✓ ${dominios.length} domínios cognitivos verificados/criados`);

  let template = await prisma.templateAvaliacao.findFirst({
    where: {
      mes_referencia: 11,
      ano_referencia: 2025,
      ativo: true,
    },
  });
  if (!template) {
    template = await prisma.templateAvaliacao.create({
      data: {
        nome: 'Avaliação Cognitiva Padrão – Novembro/2025',
        mes_referencia: 11,
        ano_referencia: 2025,
        ativo: true,
        observacoes: 'Template de exemplo para novembro de 2025',
      },
    });
    console.log('✓ Template de avaliação criado:', template.nome);
  } else {
    console.log('✓ Template de avaliação já existe:', template.nome);
  }

  const itensTemplate: Prisma.ItemTemplateUncheckedCreateInput[] = [
    {
      templateId: template.id,
      dominioId: dominiosMap['Fluência verbal'],
      codigo_item: 'Q1_escritores_qtd',
      titulo: 'Quantidade de escritores citados',
      descricao: 'Quantos escritores o aluno conseguiu citar em 1 minuto?',
      tipo_resposta: TipoResposta.NUMERO,
      ordem: 1,
      regra_pontuacao: JSON.stringify({
        tipo: 'faixas',
        faixas: [
          { ate: 5, pontos: 1 },
          { ate: 10, pontos: 2 },
          { acima: 10, pontos: 3 },
        ],
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Fluência verbal'],
      codigo_item: 'Q2_cantores_qtd',
      titulo: 'Quantidade de cantores citados',
      descricao: 'Quantos cantores o aluno conseguiu citar em 1 minuto?',
      tipo_resposta: TipoResposta.NUMERO,
      ordem: 2,
      regra_pontuacao: JSON.stringify({
        tipo: 'faixas',
        faixas: [
          { ate: 5, pontos: 1 },
          { ate: 10, pontos: 2 },
          { acima: 10, pontos: 3 },
        ],
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Cultura & memória semântica'],
      codigo_item: 'Q3_capital_brasil',
      titulo: 'Qual a capital do Brasil?',
      descricao: 'Resposta correta: Brasília',
      tipo_resposta: TipoResposta.SIM_NAO,
      ordem: 3,
      regra_pontuacao: JSON.stringify({
        tipo: 'sim_nao',
        sim: 1,
        nao: 0,
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Cultura & memória semântica'],
      codigo_item: 'Q4_presidente_atual',
      titulo: 'Quem é o presidente atual do Brasil?',
      descricao: 'Resposta correta: Sim',
      tipo_resposta: TipoResposta.SIM_NAO,
      ordem: 4,
      regra_pontuacao: JSON.stringify({
        tipo: 'sim_nao',
        sim: 1,
        nao: 0,
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Interpretação'],
      codigo_item: 'Q5_texto_compreensao',
      titulo: 'Compreendeu o texto apresentado?',
      descricao: 'Após leitura de um texto curto',
      tipo_resposta: TipoResposta.OPCAO_UNICA,
      ordem: 5,
      config_opcoes: JSON.stringify(['Totalmente', 'Parcialmente', 'Pouco', 'Não compreendeu']),
      regra_pontuacao: JSON.stringify({
        tipo: 'mapa',
        mapa: {
          'Totalmente': 3,
          'Parcialmente': 2,
          'Pouco': 1,
          'Não compreendeu': 0,
        },
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Atenção visual'],
      codigo_item: 'Q6_encontrar_diferenca',
      titulo: 'Conseguiu encontrar as diferenças na imagem?',
      descricao: 'Número de diferenças encontradas (máximo 5)',
      tipo_resposta: TipoResposta.NUMERO,
      ordem: 6,
      regra_pontuacao: JSON.stringify({
        tipo: 'faixas',
        faixas: [
          { ate: 2, pontos: 1 },
          { ate: 4, pontos: 2 },
          { acima: 4, pontos: 3 },
        ],
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Auto-percepção'],
      codigo_item: 'Q7_auto_avaliacao_memoria',
      titulo: 'Como você avalia sua memória?',
      descricao: 'Auto-percepção do aluno sobre sua memória',
      tipo_resposta: TipoResposta.ESCALA,
      ordem: 7,
      config_opcoes: JSON.stringify(['Excelente', 'Boa', 'Regular', 'Ruim', 'Muito ruim']),
      regra_pontuacao: JSON.stringify({
        tipo: 'mapa',
        mapa: {
          'Excelente': 5,
          'Boa': 4,
          'Regular': 3,
          'Ruim': 2,
          'Muito ruim': 1,
        },
      }),
    },
    {
      templateId: template.id,
      dominioId: dominiosMap['Auto-percepção'],
      codigo_item: 'Q8_auto_avaliacao_atencao',
      titulo: 'Como você avalia sua atenção?',
      descricao: 'Auto-percepção do aluno sobre sua atenção',
      tipo_resposta: TipoResposta.ESCALA,
      ordem: 8,
      config_opcoes: JSON.stringify(['Excelente', 'Boa', 'Regular', 'Ruim', 'Muito ruim']),
      regra_pontuacao: JSON.stringify({
        tipo: 'mapa',
        mapa: {
          'Excelente': 5,
          'Boa': 4,
          'Regular': 3,
          'Ruim': 2,
          'Muito ruim': 1,
        },
      }),
    },
  ];

  for (const itemData of itensTemplate) {
    const existing = await prisma.itemTemplate.findFirst({
      where: {
        templateId: itemData.templateId,
        codigo_item: itemData.codigo_item,
      },
    });
    if (!existing) {
      await prisma.itemTemplate.create({
        data: itemData,
      });
    }
  }
  console.log(`✓ ${itensTemplate.length} itens de template verificados/criados`);

  console.log('\n✅ Seed concluído com sucesso!');
  console.log('\n📝 Credenciais de acesso:');
  console.log('   Admin: admin@metis.com / admin123');
  console.log('   Moderador: moderador@metis.com / mod123');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

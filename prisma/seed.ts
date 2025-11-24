import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed do banco de dados...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const modPassword = await bcrypt.hash('mod123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@metis.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@metis.com',
      senha_hash: adminPassword,
      perfil: 'ADMIN',
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
      perfil: 'MODERADOR',
    },
  });
  console.log('✓ Moderador criado:', moderador.email);

  const turmaAurora = await prisma.turma.upsert({
    where: { id: 'turma-aurora-1' },
    update: {},
    create: {
      id: 'turma-aurora-1',
      nome_turma: 'Aurora – Segunda 18h',
      dia_semana: 'Segunda-feira',
      horario: '18:00',
      turno: 'NOITE',
      moderadorId: moderador.id,
    },
  });
  console.log('✓ Turma criada:', turmaAurora.nome_turma);

  const turmaVespera = await prisma.turma.upsert({
    where: { id: 'turma-vespera-1' },
    update: {},
    create: {
      id: 'turma-vespera-1',
      nome_turma: 'Véspera – Quarta 15h',
      dia_semana: 'Quarta-feira',
      horario: '15:00',
      turno: 'TARDE',
      moderadorId: moderador.id,
    },
  });
  console.log('✓ Turma criada:', turmaVespera.nome_turma);

  const alunos = [
    { nome: 'João Silva', turmaId: turmaAurora.id },
    { nome: 'Maria Santos', turmaId: turmaAurora.id },
    { nome: 'Pedro Oliveira', turmaId: turmaAurora.id },
    { nome: 'Ana Costa', turmaId: turmaVespera.id },
    { nome: 'Carlos Souza', turmaId: turmaVespera.id },
  ];

  for (const alunoData of alunos) {
    await prisma.aluno.upsert({
      where: { id: `aluno-${alunoData.nome.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `aluno-${alunoData.nome.toLowerCase().replace(/\s+/g, '-')}`,
        ...alunoData,
        observacoes: 'Aluno participativo',
      },
    });
  }
  console.log(`✓ ${alunos.length} alunos criados`);

  const dominios = [
    {
      id: 'dominio-fluencia',
      nome: 'Fluência verbal',
      descricao: 'Capacidade de produzir palavras rapidamente',
      pontuacao_maxima: 10,
    },
    {
      id: 'dominio-cultura',
      nome: 'Cultura & memória semântica',
      descricao: 'Conhecimento geral e memória de fatos',
      pontuacao_maxima: 10,
    },
    {
      id: 'dominio-interpretacao',
      nome: 'Interpretação',
      descricao: 'Compreensão e análise de informações',
      pontuacao_maxima: 10,
    },
    {
      id: 'dominio-atencao',
      nome: 'Atenção visual',
      descricao: 'Foco e concentração em estímulos visuais',
      pontuacao_maxima: 10,
    },
    {
      id: 'dominio-auto-percepcao',
      nome: 'Auto-percepção',
      descricao: 'Consciência sobre o próprio desempenho',
      pontuacao_maxima: 10,
    },
  ];

  for (const dominioData of dominios) {
    await prisma.dominioCognitivo.upsert({
      where: { id: dominioData.id },
      update: {},
      create: dominioData,
    });
  }
  console.log(`✓ ${dominios.length} domínios cognitivos criados`);

  const template = await prisma.templateAvaliacao.upsert({
    where: { id: 'template-nov-2024' },
    update: {},
    create: {
      id: 'template-nov-2024',
      nome: 'Avaliação Cognitiva Padrão – Novembro/2024',
      mes_referencia: 11,
      ano_referencia: 2024,
      ativo: true,
      observacoes: 'Template de exemplo para novembro de 2024',
    },
  });
  console.log('✓ Template de avaliação criado:', template.nome);

  const itensTemplate = [
    {
      templateId: template.id,
      dominioId: 'dominio-fluencia',
      codigo_item: 'Q1_escritores_qtd',
      titulo: 'Quantidade de escritores citados',
      descricao: 'Quantos escritores o aluno conseguiu citar em 1 minuto?',
      tipo_resposta: 'NUMERO',
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
      dominioId: 'dominio-fluencia',
      codigo_item: 'Q2_cantores_qtd',
      titulo: 'Quantidade de cantores citados',
      descricao: 'Quantos cantores o aluno conseguiu citar em 1 minuto?',
      tipo_resposta: 'NUMERO',
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
      dominioId: 'dominio-cultura',
      codigo_item: 'Q3_capital_brasil',
      titulo: 'Qual a capital do Brasil?',
      descricao: 'Resposta correta: Brasília',
      tipo_resposta: 'SIM_NAO',
      ordem: 3,
      regra_pontuacao: JSON.stringify({
        tipo: 'sim_nao',
        sim: 1,
        nao: 0,
      }),
    },
    {
      templateId: template.id,
      dominioId: 'dominio-cultura',
      codigo_item: 'Q4_presidente_atual',
      titulo: 'Quem é o presidente atual do Brasil?',
      descricao: 'Resposta correta: Sim',
      tipo_resposta: 'SIM_NAO',
      ordem: 4,
      regra_pontuacao: JSON.stringify({
        tipo: 'sim_nao',
        sim: 1,
        nao: 0,
      }),
    },
    {
      templateId: template.id,
      dominioId: 'dominio-interpretacao',
      codigo_item: 'Q5_texto_compreensao',
      titulo: 'Compreendeu o texto apresentado?',
      descricao: 'Após leitura de um texto curto',
      tipo_resposta: 'OPCAO_UNICA',
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
      dominioId: 'dominio-atencao',
      codigo_item: 'Q6_encontrar_diferenca',
      titulo: 'Conseguiu encontrar as diferenças na imagem?',
      descricao: 'Número de diferenças encontradas (máximo 5)',
      tipo_resposta: 'NUMERO',
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
      dominioId: 'dominio-auto-percepcao',
      codigo_item: 'Q7_auto_avaliacao_memoria',
      titulo: 'Como você avalia sua memória?',
      descricao: 'Auto-percepção do aluno sobre sua memória',
      tipo_resposta: 'ESCALA',
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
      dominioId: 'dominio-auto-percepcao',
      codigo_item: 'Q8_auto_avaliacao_atencao',
      titulo: 'Como você avalia sua atenção?',
      descricao: 'Auto-percepção do aluno sobre sua atenção',
      tipo_resposta: 'ESCALA',
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
    await prisma.itemTemplate.upsert({
      where: { id: `item-${itemData.codigo_item}` },
      update: {},
      create: {
        id: `item-${itemData.codigo_item}`,
        ...itemData,
      },
    });
  }
  console.log(`✓ ${itensTemplate.length} itens de template criados`);

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

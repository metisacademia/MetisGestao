import { prisma } from '../lib/prisma';

async function seed() {
  console.log('🌱 Iniciando seed de dados para relatórios...');

  const alunos = await prisma.aluno.findMany({ take: 5 });

  if (alunos.length === 0) {
    console.log('❌ Nenhum aluno encontrado. Execute o seed principal primeiro.');
    return;
  }

  const mesesPassados = [
    { mes: 10, ano: 2025 },
    { mes: 9, ano: 2025 },
    { mes: 8, ano: 2025 },
    { mes: 7, ano: 2025 },
    { mes: 6, ano: 2025 },
    { mes: 5, ano: 2025 },
  ];

  for (const aluno of alunos) {
    console.log(`📊 Processando aluno: ${aluno.nome}`);

    for (const { mes, ano } of mesesPassados) {
      const datasDoMes: Date[] = [];
      const primeiroDia = new Date(ano, mes - 1, 1);
      const ultimoDia = new Date(ano, mes, 0);

      for (let dia = 1; dia <= ultimoDia.getDate(); dia += 7) {
        datasDoMes.push(new Date(ano, mes - 1, dia, 12, 0, 0));
      }

      for (const data of datasDoMes) {
        const presente = Math.random() > 0.2;
        await prisma.presenca.upsert({
          where: {
            alunoId_data: {
              alunoId: aluno.id,
              data,
            },
          },
          create: {
            alunoId: aluno.id,
            data,
            presente,
          },
          update: {
            presente,
          },
        });
      }
    }

    const tiposEvento: Array<'SAUDE' | 'ROTINA' | 'TURMA' | 'OUTROS'> = ['SAUDE', 'ROTINA', 'TURMA', 'OUTROS'];
    const eventosExemplo = [
      { titulo: 'Início de tratamento médico', tipo: 'SAUDE' as const, descricao: 'Início de acompanhamento com fonoaudiólogo' },
      { titulo: 'Mudança de escola', tipo: 'ROTINA' as const, descricao: 'Transferência para escola mais próxima' },
      { titulo: 'Mudança de turma', tipo: 'TURMA' as const, descricao: 'Mudou para horário da tarde' },
      { titulo: 'Viagem em família', tipo: 'OUTROS' as const, descricao: 'Ausente por 2 semanas' },
    ];

    const numEventos = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numEventos; i++) {
      const eventoBase = eventosExemplo[Math.floor(Math.random() * eventosExemplo.length)];
      const mesEvento = mesesPassados[Math.floor(Math.random() * mesesPassados.length)];
      const diaEvento = Math.floor(Math.random() * 28) + 1;

      await prisma.eventoAluno.create({
        data: {
          alunoId: aluno.id,
          data: new Date(mesEvento.ano, mesEvento.mes - 1, diaEvento, 12, 0, 0),
          titulo: eventoBase.titulo,
          descricao: eventoBase.descricao,
          tipo: eventoBase.tipo,
        },
      });
    }
  }

  console.log('✅ Seed de relatórios concluído!');
  console.log('📋 Dados criados:');
  console.log('   - Presenças para os últimos 6 meses');
  console.log('   - Eventos relevantes aleatórios');
}

seed()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });

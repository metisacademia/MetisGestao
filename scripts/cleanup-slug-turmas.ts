import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable must be provided');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Procurando turmas com IDs de slug...');

  // Find turmas with slug-style IDs (not UUIDs)
  const slugTurmas = await prisma.turma.findMany({
    where: {
      id: {
        not: {
          // UUID pattern
          contains: '-',
        },
      },
    },
  });

  // Also directly check for the known slug IDs
  const knownSlugIds = ['turma-aurora-1', 'turma-vespera-1'];

  for (const slugId of knownSlugIds) {
    const turma = await prisma.turma.findUnique({ where: { id: slugId } });
    if (turma) {
      console.log(`📋 Encontrada turma com slug ID: ${turma.id} (${turma.nome_turma})`);

      // Count related data
      const alunosCount = await prisma.aluno.count({ where: { turmaId: turma.id } });
      const avaliacoesCount = await prisma.avaliacao.count({ where: { turmaId: turma.id } });

      console.log(`   - ${alunosCount} alunos`);
      console.log(`   - ${avaliacoesCount} avaliações`);

      // Delete related data first (avaliacoes don't cascade from turma)
      if (avaliacoesCount > 0) {
        await prisma.avaliacao.deleteMany({ where: { turmaId: turma.id } });
        console.log(`   ✓ Deletadas ${avaliacoesCount} avaliações`);
      }

      // Delete the turma (cascades to alunos)
      await prisma.turma.delete({ where: { id: turma.id } });
      console.log(`✅ Turma "${turma.nome_turma}" deletada com sucesso`);
    }
  }

  console.log('\n✅ Limpeza concluída! Agora execute: npm run seed');
}

main()
  .catch((e) => {
    console.error('❌ Erro na limpeza:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from '@/lib/prisma';
import TemplatesContent from './content';

export default async function TemplatesPage() {
  const templates = await prisma.templateAvaliacao.findMany({
    include: {
      _count: { select: { itens: true } },
    },
    orderBy: [{ ano_referencia: 'desc' }, { mes_referencia: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Templates de Avaliação</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os modelos de avaliação mensal
        </p>
      </div>

      <TemplatesContent templatesIniciais={templates} />
    </div>
  );
}

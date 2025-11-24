import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TemplateContent from './content';
import { notFound } from 'next/navigation';

export default async function TemplateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const template = await prisma.templateAvaliacao.findUnique({
    where: { id: params.id },
    include: {
      itens: {
        include: { dominio: true },
        orderBy: { ordem: 'asc' },
      },
    },
  });

  if (!template) {
    notFound();
  }

  const dominios = await prisma.dominioCognitivo.findMany({
    orderBy: { nome: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{template.nome}</h1>
            <p className="text-muted-foreground mt-2">
              {String(template.mes_referencia).padStart(2, '0')}/{template.ano_referencia}
            </p>
          </div>
          <Badge className={template.ativo ? 'bg-green-100 text-green-800' : ''}>
            {template.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </div>

      <TemplateContent 
        template={template} 
        dominios={dominios}
      />
    </div>
  );
}

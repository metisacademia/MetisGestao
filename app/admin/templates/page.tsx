import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Templates</CardTitle>
          <CardDescription>
            Total: {templates.length} template(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Mês/Ano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.nome}</TableCell>
                  <TableCell>
                    {String(template.mes_referencia).padStart(2, '0')}/{template.ano_referencia}
                  </TableCell>
                  <TableCell>
                    {template.ativo ? (
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>{template._count.itens}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/templates/${template.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Ver itens
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

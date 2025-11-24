import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function DominiosPage() {
  const dominios = await prisma.dominioCognitivo.findMany({
    orderBy: { nome: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Domínios Cognitivos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os domínios de avaliação
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Domínios</CardTitle>
          <CardDescription>
            Total: {dominios.length} domínio(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Pontuação Máxima</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dominios.map((dominio) => (
                <TableRow key={dominio.id}>
                  <TableCell className="font-medium">{dominio.nome}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {dominio.descricao || '-'}
                  </TableCell>
                  <TableCell>{dominio.pontuacao_maxima}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

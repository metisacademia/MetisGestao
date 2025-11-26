'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

interface Template {
  id: string;
  nome: string;
  mes_referencia: number;
  ano_referencia: number;
  ativo: boolean;
  _count: { itens: number };
}

export default function TemplatesContent({
  templatesIniciais,
}: {
  templatesIniciais: Template[];
}) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(templatesIniciais);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nome, setNome] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [ativo, setAtivo] = useState(true);

  const meses = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const handleRecarregarTemplates = async () => {
    const response = await fetch('/api/admin/templates');
    if (response.ok) {
      const dados = await response.json();
      setTemplates(dados);
    }
  };

  const resetForm = () => {
    setNome('');
    setMes('');
    setAno(new Date().getFullYear().toString());
    setAtivo(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          mes_referencia: mes,
          ano_referencia: ano,
          ativo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao criar template');
        setLoading(false);
        return;
      }

      const novoTemplate = await response.json();
      
      await handleRecarregarTemplates();
      setDialogAberto(false);
      resetForm();
      setLoading(false);

      router.push(`/admin/templates/${novoTemplate.id}`);
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={dialogAberto} onOpenChange={(open) => {
          setDialogAberto(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>+ Novo Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Template de Avaliação</DialogTitle>
              <DialogDescription>
                Crie um novo modelo de avaliação mensal
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Template *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Avaliação Mensal - Março 2025"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mes">Mês *</Label>
                    <select
                      id="mes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">Selecione</option>
                      {meses.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano *</Label>
                    <Input
                      id="ano"
                      type="number"
                      min="2000"
                      max="2100"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="ativo"
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="ativo" className="cursor-pointer">
                    Template ativo
                  </Label>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogAberto(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Criar Template'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
    </>
  );
}

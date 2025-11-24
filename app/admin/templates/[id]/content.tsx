'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import FormularioItem from '@/components/FormularioItem';

interface Dominio {
  id: string;
  nome: string;
}

interface Item {
  id: string;
  codigo_item: string;
  titulo: string;
  descricao?: string;
  tipo_resposta: string;
  ordem: number;
  dominio: Dominio;
  ativo: boolean;
}

interface Template {
  id: string;
  nome: string;
  mes_referencia: number;
  ano_referencia: number;
  ativo: boolean;
  itens: Item[];
}

export default function TemplateContent({
  template,
  dominios,
}: {
  template: Template;
  dominios: Dominio[];
}) {
  const [itens, setItens] = useState<Item[]>(template.itens);
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Item | null>(null);

  const handleRecarregarItens = async () => {
    const response = await fetch(`/api/admin/templates/${template.id}/itens`);
    if (response.ok) {
      const dados = await response.json();
      setItens(dados);
      setMostraFormulario(false);
      setItemParaEditar(null);
    }
  };

  const handleEditar = (item: Item) => {
    setItemParaEditar(item);
    setMostraFormulario(true);
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      const response = await fetch(`/api/admin/templates/${template.id}/itens/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await handleRecarregarItens();
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  const handleCancelar = () => {
    setMostraFormulario(false);
    setItemParaEditar(null);
  };

  return (
    <>
      {mostraFormulario && (
        <FormularioItem
          templateId={template.id}
          dominios={dominios}
          onSubmit={handleRecarregarItens}
          itemParaEditar={itemParaEditar || undefined}
        />
      )}

      {!mostraFormulario && (
        <Button onClick={() => setMostraFormulario(true)} className="w-full">
          + Novo Item
        </Button>
      )}

      {mostraFormulario && (
        <Button onClick={handleCancelar} variant="outline" className="w-full">
          Cancelar
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Itens do Template</CardTitle>
          <CardDescription>
            Total: {itens.length} item(ns)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Domínio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo_item}</TableCell>
                  <TableCell>{item.titulo}</TableCell>
                  <TableCell>{item.dominio.nome}</TableCell>
                  <TableCell>{item.tipo_resposta}</TableCell>
                  <TableCell>
                    {item.ativo ? (
                      <span className="text-green-600 text-sm">Ativo</span>
                    ) : (
                      <span className="text-red-600 text-sm">Inativo</span>
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      onClick={() => handleEditar(item)}
                      size="sm"
                      variant="outline"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeletar(item.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Deletar
                    </Button>
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

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Dominio {
  id: string;
  nome: string;
}

interface ItemParaEditar {
  id: string;
  codigo_item: string;
  titulo: string;
  descricao?: string;
  tipo_resposta: string;
  ordem: number;
  ativo: boolean;
}

interface FormularioItemProps {
  templateId: string;
  dominios: Dominio[];
  onSubmit?: () => void;
  itemParaEditar?: ItemParaEditar;
}

export default function FormularioItem({
  templateId,
  dominios,
  onSubmit,
  itemParaEditar,
}: FormularioItemProps) {
  const [codigo_item, setCodigoItem] = useState(itemParaEditar?.codigo_item || '');
  const [titulo, setTitulo] = useState(itemParaEditar?.titulo || '');
  const [descricao, setDescricao] = useState(itemParaEditar?.descricao || '');
  const [tipo_resposta, setTipoResposta] = useState(itemParaEditar?.tipo_resposta || 'NUMERO');
  const [dominioId, setDominioId] = useState('');
  const [ordem, setOrdem] = useState(itemParaEditar?.ordem || 0);
  const [ativo, setAtivo] = useState(itemParaEditar?.ativo ?? true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = itemParaEditar
        ? `/api/admin/templates/${templateId}/itens/${itemParaEditar.id}`
        : `/api/admin/templates/${templateId}/itens`;
      const method = itemParaEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_item,
          titulo,
          descricao,
          tipo_resposta,
          dominioId,
          ordem,
          ativo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao salvar item');
        setLoading(false);
        return;
      }

      // Reset form
      setCodigoItem('');
      setTitulo('');
      setDescricao('');
      setTipoResposta('NUMERO');
      setDominioId('');
      setOrdem(0);
      setAtivo(true);

      onSubmit?.();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{itemParaEditar ? 'Editar Item' : 'Novo Item'}</CardTitle>
        <CardDescription>
          {itemParaEditar ? 'Atualize o item do template' : 'Adicione um novo item ao template'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="codigo_item">Código do Item</Label>
              <Input
                id="codigo_item"
                placeholder="Ex: A1"
                value={codigo_item}
                onChange={(e) => setCodigoItem(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Ex: Fluência Verbal"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Descrição detalhada do item..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_resposta">Tipo de Resposta</Label>
              <select
                id="tipo_resposta"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={tipo_resposta}
                onChange={(e) => setTipoResposta(e.target.value)}
                disabled={loading}
              >
                <option value="NUMERO">Numérico</option>
                <option value="SIM_NAO">Sim/Não</option>
                <option value="OPCAO_UNICA">Opção Única</option>
                <option value="ESCALA">Escala</option>
                <option value="TEXTO">Texto</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominioId">Domínio Cognitivo</Label>
              <select
                id="dominioId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={dominioId}
                onChange={(e) => setDominioId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecione um domínio</option>
                {dominios.map((dominio) => (
                  <option key={dominio.id} value={dominio.id}>
                    {dominio.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                id="ordem"
                type="number"
                value={ordem}
                onChange={(e) => setOrdem(parseInt(e.target.value))}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <input
                id="ativo"
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
                disabled={loading}
                className="w-4 h-4"
              />
              <Label htmlFor="ativo" className="m-0">Ativo</Label>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

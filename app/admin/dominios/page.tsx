'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

interface Dominio {
  id: string;
  nome: string;
  descricao: string | null;
  pontuacao_maxima: number;
}

export default function DominiosPage() {
  const [dominios, setDominios] = useState<Dominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pontuacaoMaxima, setPontuacaoMaxima] = useState('10');

  const carregarDominios = async () => {
    try {
      const response = await fetch('/api/admin/dominios');
      if (response.ok) {
        const dados = await response.json();
        setDominios(dados);
      }
    } catch (error) {
      console.error('Erro ao carregar domínios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDominios();
  }, []);

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setPontuacaoMaxima('10');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      const response = await fetch('/api/admin/dominios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao: descricao || null,
          pontuacao_maxima: parseFloat(pontuacaoMaxima),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao criar domínio');
        setFormLoading(false);
        return;
      }

      resetForm();
      setDialogOpen(false);
      await carregarDominios();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Domínios Cognitivos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os domínios de avaliação
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Domínios Cognitivos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os domínios de avaliação
        </p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-full">+ Novo Domínio</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Domínio Cognitivo</DialogTitle>
            <DialogDescription>
              Adicione um novo domínio de avaliação
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Ex: Fluência"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={formLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Descrição do domínio (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={formLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pontuacao_maxima">Pontuação Máxima *</Label>
              <Input
                id="pontuacao_maxima"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="10"
                value={pontuacaoMaxima}
                onChange={(e) => setPontuacaoMaxima(e.target.value)}
                required
                disabled={formLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={formLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              {dominios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum domínio cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                dominios.map((dominio) => (
                  <TableRow key={dominio.id}>
                    <TableCell className="font-medium">{dominio.nome}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {dominio.descricao || '-'}
                    </TableCell>
                    <TableCell>{dominio.pontuacao_maxima}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

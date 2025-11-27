'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioItem from '@/components/FormularioItem';
import { Loader2, Users, CheckCircle2 } from 'lucide-react';

interface Dominio {
  id: string;
  nome: string;
}

interface Item {
  id: string;
  codigo_item: string;
  titulo: string;
  descricao?: string | null;
  tipo_resposta: string;
  ordem: number;
  dominio: Dominio;
  ativo: boolean;
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

interface Template {
  id: string;
  nome: string;
  mes_referencia: number;
  ano_referencia: number;
  ativo: boolean;
  itens: Item[];
}

interface Turma {
  id: string;
  nome_turma: string;
  moderador?: {
    nome: string;
  };
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
  const [itemParaEditar, setItemParaEditar] = useState<ItemParaEditar | null>(null);
  
  const [dialogAberto, setDialogAberto] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmasSelecionadas, setTurmasSelecionadas] = useState<string[]>([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState<{
    avaliacoesCriadas: number;
    avaliacoesExistentes: number;
    totalAlunos: number;
    turmasProcessadas: number;
  } | null>(null);

  useEffect(() => {
    if (dialogAberto && turmas.length === 0) {
      carregarTurmas();
    }
  }, [dialogAberto]);

  const carregarTurmas = async () => {
    setCarregandoTurmas(true);
    try {
      const response = await fetch('/api/admin/turmas');
      if (response.ok) {
        const dados = await response.json();
        setTurmas(dados);
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setCarregandoTurmas(false);
    }
  };

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
    setItemParaEditar({
      ...item,
      descricao: item.descricao ?? undefined,
    });
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

  const toggleTurma = (turmaId: string) => {
    setTurmasSelecionadas(prev => 
      prev.includes(turmaId) 
        ? prev.filter((id: any) => id !== turmaId)
        : [...prev, turmaId]
    );
  };

  const toggleTodasTurmas = () => {
    if (turmasSelecionadas.length === turmas.length) {
      setTurmasSelecionadas([]);
    } else {
      setTurmasSelecionadas(turmas.map((t: any) => t.id));
    }
  };

  const gerarAvaliacoes = async () => {
    setGerando(true);
    setResultado(null);

    try {
      const promises = turmasSelecionadas.length === 0 || turmasSelecionadas.length === turmas.length
        ? [fetch('/api/admin/gerar-avaliacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ templateId: template.id }),
          })]
        : turmasSelecionadas.map((turmaId: any) =>
            fetch('/api/admin/gerar-avaliacoes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ templateId: template.id, turmaId }),
            })
          );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((r: any) => r.json()));
      
      const totalResult = results.reduce(
        (acc, r) => ({
          avaliacoesCriadas: acc.avaliacoesCriadas + (r.avaliacoesCriadas || 0),
          avaliacoesExistentes: acc.avaliacoesExistentes + (r.avaliacoesExistentes || 0),
          totalAlunos: acc.totalAlunos + (r.totalAlunos || 0),
          turmasProcessadas: acc.turmasProcessadas + (r.turmasProcessadas || 0),
        }),
        { avaliacoesCriadas: 0, avaliacoesExistentes: 0, totalAlunos: 0, turmasProcessadas: 0 }
      );

      setResultado(totalResult);
    } catch (error) {
      console.error('Erro ao gerar avaliações:', error);
      alert('Erro ao gerar avaliações. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setTurmasSelecionadas([]);
    setResultado(null);
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

      <div className="flex gap-3">
        {!mostraFormulario && (
          <Button onClick={() => setMostraFormulario(true)} className="flex-1">
            + Novo Item
          </Button>
        )}

        {mostraFormulario && (
          <Button onClick={handleCancelar} variant="outline" className="flex-1">
            Cancelar
          </Button>
        )}

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gerar Avaliações para Turmas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gerar Avaliações</DialogTitle>
              <DialogDescription>
                Crie avaliações em rascunho para todos os alunos das turmas selecionadas.
                <br />
                <span className="text-xs text-muted-foreground">
                  Template: {template.nome} ({String(template.mes_referencia).padStart(2, '0')}/{template.ano_referencia})
                </span>
              </DialogDescription>
            </DialogHeader>

            {resultado ? (
              <div className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-lg">Avaliações Geradas!</h4>
                    <p className="text-sm text-muted-foreground">
                      Processo concluído com sucesso
                    </p>
                  </div>
                </div>
                <div className="space-y-2 bg-muted p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Avaliações criadas:</span>
                    <span className="font-semibold text-green-600">{resultado.avaliacoesCriadas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Já existentes (ignoradas):</span>
                    <span className="font-semibold text-amber-600">{resultado.avaliacoesExistentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de alunos:</span>
                    <span className="font-semibold">{resultado.totalAlunos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turmas processadas:</span>
                    <span className="font-semibold">{resultado.turmasProcessadas}</span>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button onClick={fecharDialog}>Fechar</Button>
                </DialogFooter>
              </div>
            ) : (
              <>
                <div className="py-4">
                  {carregandoTurmas ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Selecione as turmas:</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleTodasTurmas}
                          type="button"
                        >
                          {turmasSelecionadas.length === turmas.length ? 'Desmarcar todas' : 'Selecionar todas'}
                        </Button>
                      </div>
                      <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                        {turmas.map((turma) => (
                          <label
                            key={turma.id}
                            className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={turmasSelecionadas.includes(turma.id)}
                              onChange={() => toggleTurma(turma.id)}
                              className="w-4 h-4"
                            />
                            <div>
                              <div className="font-medium">{turma.nome_turma}</div>
                              {turma.moderador && (
                                <div className="text-xs text-muted-foreground">
                                  Moderador: {turma.moderador.nome}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                      {turmas.length === 0 && !carregandoTurmas && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhuma turma cadastrada
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {turmasSelecionadas.length === 0 
                          ? 'Nenhuma turma selecionada = todas as turmas serão processadas'
                          : `${turmasSelecionadas.length} turma(s) selecionada(s)`}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={fecharDialog}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={gerarAvaliacoes} 
                    disabled={gerando || carregandoTurmas}
                  >
                    {gerando ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      'Gerar Avaliações'
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

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

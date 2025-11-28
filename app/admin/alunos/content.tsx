'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormularioAluno from '@/components/FormularioAluno';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV, generateCSVFilename, formatDateForCSV } from '@/lib/csv-utils';

interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  turma: { id: string; nome_turma: string };
  data_nascimento?: Date | null;
  observacoes?: string | null;
}

interface AlunoParaEditar {
  id: string;
  nome: string;
  turmaId: string;
  data_nascimento?: string;
  observacoes?: string;
}

interface Turma {
  id: string;
  nome_turma: string;
}

export default function AlunosContent({
  alunosIniciais,
  turmas,
}: {
  alunosIniciais: Aluno[];
  turmas: Turma[];
}) {
  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [busca, setBusca] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('all');
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState<AlunoParaEditar | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [alunoParaDeletar, setAlunoParaDeletar] = useState<{ id: string; nome: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPagina(1);
  }, [busca, turmaSelecionada]);

  const alunosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return alunos.filter((aluno) => {
      const atendeBusca = aluno.nome.toLowerCase().includes(termo);
      const atendeTurma =
        turmaSelecionada && turmaSelecionada !== 'all' ? aluno.turmaId === turmaSelecionada : true;
      return atendeBusca && atendeTurma;
    });
  }, [alunos, busca, turmaSelecionada]);

  const totalPaginas = Math.max(1, Math.ceil(alunosFiltrados.length / itensPorPagina));
  const inicio = (pagina - 1) * itensPorPagina;
  const alunosPaginados = alunosFiltrados.slice(inicio, inicio + itensPorPagina);

  const handleRecarregarAlunos = async () => {
    const response = await fetch('/api/admin/alunos');
    if (response.ok) {
      const dados = await response.json();
      setAlunos(dados);
      setMostraFormulario(false);
      setAlunoParaEditar(null);
    }
  };

  const handleEditar = (aluno: Aluno) => {
    setAlunoParaEditar({
      ...aluno,
      data_nascimento: aluno.data_nascimento 
        ? aluno.data_nascimento instanceof Date 
          ? aluno.data_nascimento.toISOString() 
          : String(aluno.data_nascimento)
        : undefined,
      observacoes: aluno.observacoes || undefined,
    });
    setMostraFormulario(true);
  };

  const handleDeletar = async (aluno: { id: string; nome: string }) => {
    setAlunoParaDeletar(aluno);
    setConfirmDialogOpen(true);
  };

  const confirmarDelecao = async () => {
    if (!alunoParaDeletar) return;

    try {
      const response = await fetch(`/api/admin/alunos/${alunoParaDeletar.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          variant: 'success',
          title: 'Sucesso!',
          description: `Aluno "${alunoParaDeletar.nome}" foi excluído com sucesso.`,
        });
        await handleRecarregarAlunos();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir o aluno. Tente novamente.',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao tentar excluir o aluno. Tente novamente.',
      });
    } finally {
      setAlunoParaDeletar(null);
    }
  };

  const handleCancelar = () => {
    setMostraFormulario(false);
    setAlunoParaEditar(null);
  };

  const handleExportCSV = () => {
    const csvData = alunosFiltrados.map(aluno => ({
      id: aluno.id,
      nome: aluno.nome,
      turma: aluno.turma.nome_turma,
      data_nascimento: formatDateForCSV(aluno.data_nascimento),
      observacoes: aluno.observacoes || '',
    }));

    const headers = {
      id: 'ID',
      nome: 'Nome',
      turma: 'Turma',
      data_nascimento: 'Data de Nascimento',
      observacoes: 'Observações',
    };

    exportToCSV(csvData, generateCSVFilename('alunos_metis'), headers);
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmarDelecao}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir o aluno "${alunoParaDeletar?.nome}"? Esta ação não pode ser desfeita.`}
      />
      {mostraFormulario && (
        <FormularioAluno
          turmas={turmas}
          onSubmit={handleRecarregarAlunos}
          alunoParaEditar={alunoParaEditar || undefined}
        />
      )}

      {!mostraFormulario && (
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => setMostraFormulario(true)} className="flex-1">
            + Novo Aluno
          </Button>
        </div>
      )}

      {mostraFormulario && (
        <Button onClick={handleCancelar} variant="outline" className="w-full">
          Cancelar
        </Button>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
          <Input
            placeholder="Buscar por nome do aluno"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full sm:w-72"
          />
          <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Todas as turmas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              {turmas.map((turma) => (
                <SelectItem key={turma.id} value={turma.id}>
                  {turma.nome_turma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {alunosFiltrados.length} aluno(s) encontrado(s)
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Total: {alunosFiltrados.length} aluno(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunosPaginados.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/alunos/${aluno.id}`}
                      className="text-primary hover:underline"
                    >
                      {aluno.nome}
                    </Link>
                  </TableCell>
                  <TableCell>{aluno.turma.nome_turma}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {aluno.observacoes || '-'}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/admin/alunos/${aluno.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleEditar(aluno)}
                      size="sm"
                      variant="outline"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeletar({ id: aluno.id, nome: aluno.nome })}
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
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>
              Página {pagina} de {totalPaginas}
            </div>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              >
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

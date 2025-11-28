'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormularioTurma from '@/components/FormularioTurma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV, generateCSVFilename, formatDateForCSV } from '@/lib/csv-utils';

interface Turma {
  id: string;
  nome_turma: string;
  dia_semana: string;
  horario: string;
  turno: string;
  moderador: { id: string; nome: string };
  _count: { alunos: number };
  capacidade_maxima?: number | null;
  data_inicio: string;
  data_fim?: string | null;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  local?: string | null;
}

interface Usuario {
  id: string;
  nome: string;
}

export default function TurmasContent({
  turmasIniciais,
  moderadores,
}: {
  turmasIniciais: Turma[];
  moderadores: Usuario[];
}) {
  const [turmas, setTurmas] = useState<Turma[]>(turmasIniciais);
  const [busca, setBusca] = useState('');
  const [turno, setTurno] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState<Turma | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [turmaParaDeletar, setTurmaParaDeletar] = useState<{ id: string; nome: string } | null>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Aberta</Badge>;
      case 'EM_ANDAMENTO':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Em Andamento</Badge>;
      case 'CONCLUIDA':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Concluída</Badge>;
      default:
        return null;
    }
  };

  useEffect(() => {
    setPagina(1);
  }, [busca, turno, statusFilter]);

  const turmasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return turmas.filter((turma) => {
      const atendeBusca = turma.nome_turma.toLowerCase().includes(termo);
      const atendeTurno = turno && turno !== 'all' ? turma.turno === turno : true;
      const atendeStatus = statusFilter && statusFilter !== 'all' ? turma.status === statusFilter : true;
      return atendeBusca && atendeTurno && atendeStatus;
    });
  }, [turmas, busca, turno, statusFilter]);

  const totalPaginas = Math.max(1, Math.ceil(turmasFiltradas.length / itensPorPagina));
  const inicio = (pagina - 1) * itensPorPagina;
  const turmasPaginadas = turmasFiltradas.slice(inicio, inicio + itensPorPagina);

  const handleRecarregarTurmas = async () => {
    const response = await fetch('/api/admin/turmas');
    if (response.ok) {
      const dados = await response.json();
      setTurmas(dados);
      setMostraFormulario(false);
      setTurmaParaEditar(null);
    }
  };

  const handleEditar = (turma: Turma) => {
    setTurmaParaEditar(turma);
    setMostraFormulario(true);
  };

  const handleDeletar = async (turma: { id: string; nome: string }) => {
    setTurmaParaDeletar(turma);
    setConfirmDialogOpen(true);
  };

  const confirmarDelecao = async () => {
    if (!turmaParaDeletar) return;

    try {
      const response = await fetch(`/api/admin/turmas/${turmaParaDeletar.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          variant: 'success',
          title: 'Sucesso!',
          description: `Turma "${turmaParaDeletar.nome}" foi excluída com sucesso.`,
        });
        await handleRecarregarTurmas();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir a turma. Tente novamente.',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao tentar excluir a turma. Tente novamente.',
      });
    } finally {
      setTurmaParaDeletar(null);
    }
  };

  const handleCancelar = () => {
    setMostraFormulario(false);
    setTurmaParaEditar(null);
  };

  const handleExportCSV = () => {
    const statusLabels = {
      ABERTA: 'Aberta',
      EM_ANDAMENTO: 'Em Andamento',
      CONCLUIDA: 'Concluída',
    };

    const csvData = turmasFiltradas.map(turma => ({
      id: turma.id,
      nome_turma: turma.nome_turma,
      moderador: turma.moderador.nome,
      status: statusLabels[turma.status] || turma.status,
      alunos: turma._count.alunos,
      capacidade_maxima: turma.capacidade_maxima || '',
      data_inicio: formatDateForCSV(turma.data_inicio),
      data_fim: formatDateForCSV(turma.data_fim),
      local: turma.local || '',
    }));

    const headers = {
      id: 'ID',
      nome_turma: 'Nome da Turma',
      moderador: 'Moderador',
      status: 'Status',
      alunos: 'Alunos',
      capacidade_maxima: 'Capacidade Máxima',
      data_inicio: 'Data de Início',
      data_fim: 'Data de Término',
      local: 'Local',
    };

    exportToCSV(csvData, generateCSVFilename('turmas_metis'), headers);
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmarDelecao}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a turma "${turmaParaDeletar?.nome}"? Esta ação não pode ser desfeita.`}
      />
      {mostraFormulario && (
        <FormularioTurma
          moderadores={moderadores}
          onSubmit={handleRecarregarTurmas}
          turmaParaEditar={
            turmaParaEditar
              ? {
                  id: turmaParaEditar.id,
                  nome_turma: turmaParaEditar.nome_turma,
                  dia_semana: turmaParaEditar.dia_semana,
                  horario: turmaParaEditar.horario,
                  turno: turmaParaEditar.turno,
                  moderadorId: turmaParaEditar.moderador.id,
                  capacidade_maxima: turmaParaEditar.capacidade_maxima,
                  data_inicio: turmaParaEditar.data_inicio,
                  data_fim: turmaParaEditar.data_fim,
                  status: turmaParaEditar.status,
                  local: turmaParaEditar.local,
                }
              : undefined
          }
        />
      )}

      {!mostraFormulario && (
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => setMostraFormulario(true)} className="flex-1">
            + Nova Turma
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
            placeholder="Buscar por nome da turma"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full sm:w-72"
          />
          <Select value={turno} onValueChange={setTurno}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todos os turnos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os turnos</SelectItem>
              <SelectItem value="MANHA">Manhã</SelectItem>
              <SelectItem value="TARDE">Tarde</SelectItem>
              <SelectItem value="NOITE">Noite</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ABERTA">Aberta</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
              <SelectItem value="CONCLUIDA">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {turmasFiltradas.length} turma(s) encontrada(s)
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Turmas</CardTitle>
          <CardDescription>
            Total: {turmasFiltradas.length} turma(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Nome da Turma</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Alunos</TableHead>
                  <TableHead className="min-w-[150px]">Dia/Horário</TableHead>
                  <TableHead className="min-w-[80px]">Turno</TableHead>
                  <TableHead className="min-w-[120px]">Datas</TableHead>
                  <TableHead className="min-w-[120px]">Moderador</TableHead>
                  <TableHead className="min-w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmasPaginadas.map((turma) => {
                  const capacidadeDisplay = turma.capacidade_maxima 
                    ? `${turma._count.alunos}/${turma.capacidade_maxima}`
                    : turma._count.alunos.toString();
                  
                  const dataInicio = turma.data_inicio ? new Date(turma.data_inicio).toLocaleDateString('pt-BR') : '-';
                  const dataFim = turma.data_fim ? new Date(turma.data_fim).toLocaleDateString('pt-BR') : '-';
                  
                  return (
                    <TableRow key={turma.id}>
                      <TableCell>
                        <div className="font-medium break-words">{turma.nome_turma}</div>
                        {turma.local && (
                          <div className="text-xs text-muted-foreground mt-1 break-all">
                            {turma.local.startsWith('http') ? (
                              <a href={turma.local} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                                {turma.local.length > 30 ? turma.local.substring(0, 30) + '...' : turma.local}
                              </a>
                            ) : (
                              <span>📍 {turma.local}</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(turma.status)}</TableCell>
                      <TableCell className="whitespace-nowrap">{capacidadeDisplay}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {turma.dia_semana} às {turma.horario}
                      </TableCell>
                      <TableCell>{turma.turno}</TableCell>
                      <TableCell>
                        <div className="text-sm whitespace-nowrap">
                          <div>Início: {dataInicio}</div>
                          {turma.data_fim && <div className="text-muted-foreground">Fim: {dataFim}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="break-words">{turma.moderador.nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => handleEditar(turma)}
                            size="sm"
                            variant="outline"
                            className="w-full sm:w-auto"
                          >
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDeletar({ id: turma.id, nome: turma.nome_turma })}
                            size="sm"
                            variant="destructive"
                            className="w-full sm:w-auto"
                          >
                            Deletar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
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

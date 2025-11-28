'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormularioTurma from '@/components/FormularioTurma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Turma {
  id: string;
  nome_turma: string;
  dia_semana: string;
  horario: string;
  turno: string;
  moderador: { id: string; nome: string };
  _count: { alunos: number };
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
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState<Turma | null>(null);

  useEffect(() => {
    setPagina(1);
  }, [busca, turno]);

  const turmasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return turmas.filter((turma) => {
      const atendeBusca = turma.nome_turma.toLowerCase().includes(termo);
      const atendeTurno = turno && turno !== 'all' ? turma.turno === turno : true;
      return atendeBusca && atendeTurno;
    });
  }, [turmas, busca, turno]);

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

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta turma?')) return;

    try {
      const response = await fetch(`/api/admin/turmas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await handleRecarregarTurmas();
      }
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
    }
  };

  const handleCancelar = () => {
    setMostraFormulario(false);
    setTurmaParaEditar(null);
  };

  return (
    <>
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
                }
              : undefined
          }
        />
      )}

      {!mostraFormulario && (
        <Button onClick={() => setMostraFormulario(true)} className="w-full">
          + Nova Turma
        </Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Turma</TableHead>
                <TableHead>Dia/Horário</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Moderador</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmasPaginadas.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell className="font-medium">{turma.nome_turma}</TableCell>
                  <TableCell>
                    {turma.dia_semana} às {turma.horario}
                  </TableCell>
                  <TableCell>{turma.turno}</TableCell>
                  <TableCell>{turma.moderador.nome}</TableCell>
                  <TableCell>{turma._count.alunos}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      onClick={() => handleEditar(turma)}
                      size="sm"
                      variant="outline"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeletar(turma.id)}
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

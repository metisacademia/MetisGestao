'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormularioTurma from '@/components/FormularioTurma';
import { Button } from '@/components/ui/button';

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
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [turmaParaEditar, setTurmaParaEditar] = useState<Turma | null>(null);

  const handleRecarregarTurmas = async () => {
    const response = await fetch('/api/coordenador/turmas');
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
      const response = await fetch(`/api/coordenador/turmas/${id}`, {
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
          apiBasePath="/api/coordenador"
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Turmas</CardTitle>
          <CardDescription>
            Total: {turmas.length} turma(s)
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
              {turmas.map((turma) => (
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
        </CardContent>
      </Card>
    </>
  );
}

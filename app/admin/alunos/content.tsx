'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormularioAluno from '@/components/FormularioAluno';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';

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
  const [mostraFormulario, setMostraFormulario] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState<AlunoParaEditar | null>(null);

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

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este aluno?')) return;

    try {
      const response = await fetch(`/api/admin/alunos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await handleRecarregarAlunos();
      }
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  const handleCancelar = () => {
    setMostraFormulario(false);
    setAlunoParaEditar(null);
  };

  return (
    <>
      {mostraFormulario && (
        <FormularioAluno
          turmas={turmas}
          onSubmit={handleRecarregarAlunos}
          alunoParaEditar={alunoParaEditar || undefined}
        />
      )}

      {!mostraFormulario && (
        <Button onClick={() => setMostraFormulario(true)} className="w-full">
          + Novo Aluno
        </Button>
      )}

      {mostraFormulario && (
        <Button onClick={handleCancelar} variant="outline" className="w-full">
          Cancelar
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Total: {alunos.length} aluno(s)
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
              {alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium">{aluno.nome}</TableCell>
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
                      onClick={() => handleDeletar(aluno.id)}
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
